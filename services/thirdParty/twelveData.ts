"use server";

import { TWELVEDATA_API_KEY } from "@/constants/env";
import { prepareHistoricalDataForManualCategory } from "@/helper/manualAssetsHistoryMaker";
import { calculateCurrentValue } from "@/lib/assetCalculation";
import { areDatesEqual } from "@/lib/helper";
import { TAsset, TTwelveDataInstrumentQuote } from "@/lib/types";
import { getConversionRate } from "@/services/thirdParty/currency";

export const getAssetQuoteFromApiBySymbol = async (
  symbol: string
): Promise<TTwelveDataInstrumentQuote> => {
  const url = `https://api.twelvedata.com/quote?symbol=${symbol}`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `apikey ${TWELVEDATA_API_KEY}`,
    },
  };

  const res = await fetch(url, options);
  const data: TTwelveDataInstrumentQuote = await res.json();

  return data;
};

export const fetchQuoteFromApi = async (asset: TAsset): Promise<TAsset> => {
  if (!asset.isManualEntry && asset.symbol) {
    try {
      const response = await fetch(
        `https://api.twelvedata.com/quote?symbol=${asset.symbol}`,
        {
          method: "GET",
          headers: {
            Authorization: `apikey ${TWELVEDATA_API_KEY}`,
          },
        }
      );

      const quote = await response.json();

      if (!quote.code || quote.code !== 404) {
        asset.prevClose = (+quote.previous_close).toFixed(2);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  }

  const updatedAsset = calculateCurrentValue(asset);
  return updatedAsset;
};

export const getHistoricalData = async (userId: string, assets: TAsset[]) => {
  const conversionRate = await getConversionRate(userId);
  if (!conversionRate) {
    throw new Error("Error fetching conversion rate");
  }
  let historicalData = [];
  for (const asset of assets) {
    if (
      !asset.isManualEntry &&
      asset.symbol &&
      parseFloat(asset.quantity) > 0
    ) {
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
          `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&dp=2&previous_close=true`,
          {
            method: "GET",
            headers: {
              Authorization: `apikey ${TWELVEDATA_API_KEY}`,
            },
          }
        );
      } else {
        res = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&dp=2&previous_close=true&start_date=${formattedStartDate}&end_date=${formattedToday}`,
          {
            method: "GET",
            headers: {
              Authorization: `apikey ${TWELVEDATA_API_KEY}`,
            },
          }
        );
      }

      const data = await res.json();
      if (data.code === 401) {
        throw new Error("Twelve Data API key is invalid");
      } else if (data.code === 429) {
        throw new Error("Twelve Data API rate limit exceeded");
      }

      // remove historical data for past dates for current day transactions
      if (
        areDatesEqual(new Date(formattedToday), new Date(formattedStartDate))
      ) {
        data.values = data.values.slice(0, 1);
      }

      if (data.code === undefined) {
        // Calculate total value of asset and add it to the data object
        data.values.forEach((dayData: any) => {
          dayData.date = new Date(dayData.datetime).getTime() / 1000;
          data.assetType = asset.category;
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
    } else {
      const manualAssetHistory = prepareHistoricalDataForManualCategory([
        asset,
      ])[0];
      const manualAssetHistoryWithAssetType = {
        ...manualAssetHistory,
        assetType: asset.category,
      };

      historicalData.push(manualAssetHistoryWithAssetType);
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
};

export const searchAssetsFromApi = async (searchQuery: string) => {
  try {
    const url = `https://api.twelvedata.com/symbol_search?symbol=${searchQuery}&outputsize=9`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `apikey ${TWELVEDATA_API_KEY}`,
      },
    };

    const res = await fetch(url, options);
    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
};
