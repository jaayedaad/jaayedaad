"use server";
import { cookies } from "next/headers";

export const calculateCurrentValue = (asset: Asset) => {
  const calculateBaseValue = () => {
    const investedValue = +asset.buyPrice * +asset.quantity;
    return investedValue;
  };

  const calculateYearsSinceCreated = () => {
    const buyDate = new Date(asset.buyDate);
    const today = new Date();
    const differenceInMilliseconds = today.getTime() - buyDate.getTime(); // Difference in milliseconds
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    return Math.floor(differenceInDays / 365);
  };

  const calculateCurrentValueForFD = () => {
    const yearsSinceCreated = calculateYearsSinceCreated();
    return (
      +asset.buyPrice *
      (1 + parseFloat(asset.quantity) / 100) ** yearsSinceCreated
    );
  };

  if (asset.type === "Deposits") {
    asset.currentValue = calculateCurrentValueForFD();
    asset.currentPrice = asset.currentValue.toString();
    asset.prevClose = asset.currentPrice;
    asset.compareValue = +asset.buyPrice;

    return {
      currentValue: asset.currentValue,
      currentPrice: asset.currentPrice,
      prevClose: asset.prevClose,
      compareValue: asset.compareValue,
    };
  } else {
    asset.compareValue = calculateBaseValue();
    asset.currentValue = asset.isManualEntry
      ? +asset.currentPrice * +asset.quantity
      : +asset.prevClose * +asset.quantity;
    return {
      currentValue: asset.currentValue,
      currentPrice: asset.currentPrice,
      prevClose: asset.prevClose,
      compareValue: asset.compareValue,
    };
  }
};

export type Asset = {
  id: string;
  name: string;
  symbol: string;
  quantity: string;
  buyPrice: string;
  buyCurrency: string;
  prevClose: string;
  type: string;
  exchange: string;
  buyDate: Date;
  userId: string;
  currentPrice: string;
  isManualEntry: boolean;
  currentValue: number;
  compareValue: number;
  transactions: {
    id: string;
    date: Date;
    quantity: string;
    price: string;
    type: string;
    assetId: string;
  }[];
  assetPriceUpdates: {
    id: string;
    price: string;
    date: Date;
    assetId: string;
  }[];
};

export async function getAssets() {
  const cookieStores = cookies();
  const cookiesArray = cookieStores.getAll();
  const cookiesString = cookiesArray
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join(";");

  let assets: Asset[] | undefined;

  const data = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/assets`, {
    method: "GET",
    headers: {
      Cookie: cookiesString,
    },
    credentials: "include",
  });
  assets = await data.json();

  if (assets && assets.length) {
    const assetQuotesPromises = assets.map(async (asset) => {
      if (asset.symbol !== null) {
        const quoteResponse = await fetch(
          `https://api.twelvedata.com/quote?symbol=${asset.symbol}`,
          {
            method: "GET",
            headers: {
              Authorization: `apikey ${process.env.NEXT_PUBLIC_TWELVEDATA_API_KEY}`,
            },
          }
        );

        const quote = await quoteResponse.json();

        if (quote.code && quote.code === 404) {
          asset.prevClose = asset.currentPrice;
        } else {
          asset.prevClose = (+quote.previous_close).toFixed(2);
        }
        calculateCurrentValue(asset);

        return asset;
      } else {
        calculateCurrentValue(asset);
        return asset;
      }
    });

    const updatedAssets = await Promise.all(assetQuotesPromises);
    return updatedAssets;
  }
}
