"use server";
import { cookies } from "next/headers";
import { getConversionRate } from "./getConversionRateAction";

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
  currentValue: number;
  compareValue: number;
  transactions: {
    id: string;
    date: Date;
    quantity: string;
    price: string;
    type: string;
    assetId: string;
    avgBuyPrice: string;
  }[];
};

export async function getAssets() {
  const cookieStores = cookies();
  const cookiesArray = cookieStores.getAll();
  const cookiesString = cookiesArray
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join(";");

  const data = await fetch("http://localhost:3000/api/assets", {
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
          asset.prevClose = matchingQuote.regularMarketPreviousClose;
        }

        // Calculate the current value of the asset
        if (asset.buyCurrency === "USD") {
          asset.compareValue =
            +asset.buyPrice * +asset.quantity * +conversionRate;
          asset.currentValue =
            +asset.prevClose * +asset.quantity * +conversionRate;
        } else {
          asset.compareValue = +asset.buyPrice * +asset.quantity;
          asset.currentValue = +asset.prevClose * +asset.quantity;
        }

        return asset;
      });

      // Return updated assets
      return updatedAssets;
    }
  }
}
