"use server";
import { cookies } from "next/headers";
import { getConversionRate } from "./getConversionRateAction";

const calculateCurrentValue = (asset: Asset, conversionRate: string) => {
  const calculateBaseValue = () => {
    if (asset.buyCurrency === "USD") {
      return +asset.buyPrice * +asset.quantity * +conversionRate;
    } else {
      return +asset.buyPrice * +asset.quantity;
    }
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

  if (asset.type === "FD") {
    asset.currentValue = calculateCurrentValueForFD();
    asset.currentPrice = (
      asset.currentValue * (asset.buyCurrency === "USD" ? +conversionRate : 1)
    ).toString();
    asset.prevClose = asset.currentPrice;
    asset.compareValue =
      +asset.buyPrice * (asset.buyCurrency === "USD" ? +conversionRate : 1);
  } else {
    asset.compareValue = calculateBaseValue();
    asset.currentValue = asset.isManualEntry
      ? +asset.currentPrice * +asset.quantity
      : +asset.prevClose * +asset.quantity;
  }

  if (asset.buyCurrency === "USD") {
    asset.currentValue *= +conversionRate;
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

  const data = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/assets`, {
    method: "GET",
    headers: {
      Cookie: cookiesString,
    },
    credentials: "include",
  });
  const assets: Asset[] = await data.json();
  const conversionRate = await getConversionRate();

  if (assets.length > 0) {
    // Get symbols from the assets
    const assetSymbols = assets.map((asset) => asset.symbol);
    const assetSymbolsQuery = assetSymbols.join("%2C");

    // Get previous close values and their currency
    const quotes = await fetch(
      `https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=${assetSymbolsQuery}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_YHFINANCE_KEY,
          "X-RapidAPI-Host": "yh-finance.p.rapidapi.com",
        },
      }
    );

    const responseData = await quotes.json();

    if (responseData.quoteResponse !== undefined) {
      const {
        quoteResponse: { result: quotesData },
      } = responseData;
      // Proceed with quotesData

      // Update assets with relevant properties
      const updatedAssets = assets.map((asset) => {
        const matchingQuote = quotesData.find(
          // @ts-ignore
          (quote) => quote.symbol === asset.symbol
        );

        if (matchingQuote) {
          asset.prevClose = matchingQuote.regularMarketPreviousClose.toFixed(2);
        } else {
          asset.prevClose = asset.currentPrice;
        }

        // Calculate the current value of the asset
        calculateCurrentValue(asset, conversionRate);

        return asset;
      });

      // Return updated assets
      return updatedAssets;
    }
  }
}
