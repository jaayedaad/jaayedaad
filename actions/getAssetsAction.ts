"use server";
import { cookies } from "next/headers";

type Asset = {
  id: string;
  name: string;
  symbol: string;
  quantity: string;
  buyPrice: string;
  buyCurrency: string;
  prevClose: string;
  buyDate: Date;
  userId: string;
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
  const {
    quoteResponse: { result: quotesData },
  } = await quotes.json();

  // Update assets with relevant properties
  const updatedAssets = assets.map((asset) => {
    const matchingQuote = quotesData.find(
      // @ts-ignore
      (quote) => quote.symbol === asset.symbol
    );

    if (matchingQuote) {
      asset.prevClose = matchingQuote.regularMarketPreviousClose;
    }

    return asset;
  });

  // Return updated assets
  return updatedAssets;
}
