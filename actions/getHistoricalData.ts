"use server";

import { TAsset } from "@/lib/types";
import { getConversionRate } from "./getConversionRateAction";

function areDatesEqual(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Set time components to 0 to ignore time
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  // Compare year, month, and day
  return d1.getTime() === d2.getTime();
}

export async function getHistoricalData(assets: TAsset[]) {
  const conversionRate = await getConversionRate();
  let historicalData = [];
  for (const asset of assets) {
    if (asset.symbol && parseFloat(asset.quantity) > 0) {
      const { symbol, transactions } = asset;
      const sortedTransactions = transactions.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Get the date from the first transaction
      const firstTransactionDate = new Date(
        new Date(sortedTransactions[0].date).toDateString()
      );

      // Format the start date
      const formattedStartDate = `${firstTransactionDate.getFullYear()}-${(
        firstTransactionDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${firstTransactionDate
        .getDate()
        .toString()
        .padStart(2, "0")} ${firstTransactionDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${firstTransactionDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${firstTransactionDate
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      // Get today's date
      const today = new Date();
      const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today
        .getDate()
        .toString()
        .padStart(2, "0")} ${today
        .getHours()
        .toString()
        .padStart(2, "0")}:${today
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${today.getSeconds().toString().padStart(2, "0")}`;

      let res: Response;
      if (
        areDatesEqual(new Date(formattedToday), new Date(formattedStartDate))
      ) {
        res = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&dp=2&previous_close=true&end_date=${formattedToday}`,
          {
            method: "GET",
            headers: {
              Authorization: `apikey ${process.env.NEXT_PUBLIC_TWELVEDATA_API_KEY}`,
            },
          }
        );
      } else {
        res = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&dp=2&previous_close=true&start_date=${formattedStartDate}&end_date=${formattedToday}`,
          {
            method: "GET",
            headers: {
              Authorization: `apikey ${process.env.NEXT_PUBLIC_TWELVEDATA_API_KEY}`,
            },
          }
        );
      }

      const data = await res.json();
      if (data.code !== 429) {
        // Calculate total value of asset and add it to the data object
        data.values.forEach((dayData: any) => {
          dayData.date = new Date(dayData.datetime).getTime() / 1000;
          data.assetType = asset.type;
          data.assetSymbol = asset.symbol;
          const assetCurrency = asset.buyCurrency.toLowerCase();
          const currencyConversion = conversionRate[assetCurrency];
          const multiplier = 1 / currencyConversion;

          if (dayData.close) {
            dayData.value = dayData.close * +asset.quantity * multiplier;
          }
        });

        historicalData.push(data);
      }
    }
  }

  historicalData.forEach((obj) => {
    let prices = obj.values;
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
