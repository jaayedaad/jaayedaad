"use server";

import { Asset } from "@/actions/getAssetsAction";
import { getConversionRate } from "./getConversionRateAction";

export async function getHistoricalData(assets: Asset[]) {
  const conversionRate = await getConversionRate();
  let historicalData = [];
  for (const asset of assets) {
    const { symbol } = asset;
    const res = await fetch(
      `https://yh-finance.p.rapidapi.com/stock/v3/get-historical-data?symbol=${symbol}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_YHFINANCE_KEY,
          "X-RapidAPI-Host": "yh-finance.p.rapidapi.com",
        },
      }
    );
    const data = await res.json();
    if (data) {
      // Calculate total value of asset and add it to the data object
      data.prices.forEach((price: any) => {
        data.assetType = asset.type;
        if (price.close) {
          if (asset.buyCurrency === "USD") {
            price.value = price.close * +conversionRate * +asset.quantity;
          } else {
            price.value = price.close * +asset.quantity;
          }
        }
      });

      historicalData.push(data);
    }
  }

  historicalData.forEach((obj) => {
    let prices = obj.prices;
    let lastNonNullValue = 0;

    // Backward pass: replace null values with the nearest non-null value preceding them
    for (let i = prices.length - 1; i >= 0; i--) {
      if (prices[i].value) {
        lastNonNullValue = prices[i].value;
      } else if (lastNonNullValue !== 0) {
        prices[i].value = lastNonNullValue;
      }
    }

    // Forward pass: replace null values with the nearest non-null value following them
    lastNonNullValue = 0;
    for (let i = 0; i < prices.length; i++) {
      if (prices[i].value) {
        lastNonNullValue = prices[i].value;
      } else if (lastNonNullValue !== 0) {
        prices[i].value = lastNonNullValue;
      }
    }
  });

  return historicalData;
}
