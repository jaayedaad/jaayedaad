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

  // Function to replace null values with the closest non-null value
  function replaceNullsWithNearest(data: any[]) {
    data.forEach((obj) => {
      let prices = obj.prices;
      let lastNonNullValue = null;

      // Forward pass: replace null values with the nearest non-null value following them
      for (let i = 0; i < prices.length; i++) {
        if (prices[i].value !== null) {
          lastNonNullValue = prices[i].value;
        } else if (lastNonNullValue !== null) {
          prices[i].value = lastNonNullValue;
        }
      }

      // Backward pass: replace null values with the nearest non-null value preceding them
      lastNonNullValue = null;
      for (let i = prices.length - 1; i >= 0; i--) {
        if (prices[i].value !== null) {
          lastNonNullValue = prices[i].value;
        } else if (lastNonNullValue !== null) {
          prices[i].value = lastNonNullValue;
        }
      }
    });
  }

  // Call the function to replace null values with the nearest non-null values
  replaceNullsWithNearest(historicalData);

  return historicalData;
}
