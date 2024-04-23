"use server";

import {
  TAsset,
  THistoricalData,
  TMFAPISearchResult,
  TMFApiInstrumentQuote,
  TTwelveDataInstrumentQuote,
  TTwelveDataResult,
} from "@/types/types";
import { getConversionRate } from "./currency";
import { calculateCurrentValue } from "@/lib/assetCalculation";

export const searchFundsFromMFApi = async (searchQuery: string) => {
  let retryCount = 0;
  const maxRetries = 5; // Maximum number of retries

  while (retryCount < maxRetries) {
    try {
      const url = `https://api.mfapi.in/mf/search?q=${encodeURIComponent(
        searchQuery
      )}`;
      const options = {
        method: "GET",
      };

      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      const data: TMFAPISearchResult[] = await res.json();

      const searchResults: TTwelveDataResult[] = data.map((result) => {
        return {
          instrument_name: result.schemeName,
          symbol: result.schemeCode.toString(),
          instrument_type: "Mutual Fund",
          exchange: "NSE",
          mic_code: "Mutual Fund",
          currency: "INR",
          country: "India",
          exchange_timezone: "Asia/Kolkata",
        };
      });
      return searchResults;
    } catch (error) {
      console.error(
        `Attempt ${
          retryCount + 1
        }: Error fetching search results for query "${searchQuery}" - ${error}`
      );
      retryCount++;
      if (retryCount === maxRetries) {
        console.error(
          "Maximum retries reached. Unable to fetch search results."
        );
        return [];
      }
    }
  }
};

export const getAssetQuoteFromMFApiBySymbol = async (
  symbol: string
): Promise<TTwelveDataInstrumentQuote | null> => {
  try {
    const url = `https://api.mfapi.in/mf/${symbol}/latest`;
    const options = {
      method: "GET",
    };

    const res = await fetch(url, options);
    const response: TMFApiInstrumentQuote = await res.json();
    const quote: TTwelveDataInstrumentQuote = {
      symbol: response.meta.scheme_code.toString(),
      name: response.meta.scheme_name,
      exchange: "NSE",
      mic_code: "Mutual Fund",
      currency: "INR",
      timestamp: 0,
      datetime: "",
      open: "0",
      high: "0",
      low: "0",
      close: response.data[0].nav.toString(),
      volume: "0",
      previous_close: response.data[0].nav.toString(),
      change: "0",
      percent_change: "0",
      average_volume: "0",
      is_market_open: false,
      fifty_two_week: {
        low: "0",
        high: "0",
        low_change: "0",
        high_change: "0",
        low_change_percent: "0",
        high_change_percent: "0",
        range: "0",
      },
    };

    return quote;
  } catch (error) {
    console.error("Error fetching asset quote:", error);
    return null;
  }
};

export const fetchQuoteFromMFApi = async (asset: TAsset): Promise<TAsset> => {
  try {
    const response = await fetch(
      `https://api.mfapi.in/mf/${asset.symbol}/latest`,
      {
        method: "GET",
      }
    );

    const quote: TMFApiInstrumentQuote = await response.json();

    asset.prevClose = (+quote.data[0].nav).toFixed(2);

    const updatedAsset = calculateCurrentValue(asset);
    return updatedAsset;
  } catch (error) {
    console.error("Error fetching quote:", error);
    return asset;
  }
};

export const getHistoricalDataFromMFApid = async (
  userId: string,
  assets: TAsset[]
): Promise<THistoricalData[]> => {
  try {
    const conversionRate = await getConversionRate(userId);
    if (!conversionRate) {
      throw new Error("Error fetching conversion rate");
    }

    let historicalData: THistoricalData[] = [];

    for (const asset of assets) {
      if (parseFloat(asset.quantity) > 0) {
        const { symbol, transactions } = asset;
        const sortedTransactions = transactions.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Get the date from the first transaction
        const firstTransactionDate =
          new Date(sortedTransactions[0].date).getTime() / 1000;

        const url = `https://api.mfapi.in/mf/${symbol}`;
        const options = {
          method: "GET",
        };

        const res = await fetch(url, options);
        const response: TMFApiInstrumentQuote = await res.json();
        const historicalValues = response.data.map((item) => {
          const assetCurrency = asset.buyCurrency.toLowerCase();
          const currencyConversion = conversionRate[assetCurrency];
          const multiplier = 1 / currencyConversion;
          // Split the string into day, month, and year components
          var dateComponents = item.date.split("-");

          // Rearrange the components to form the desired format
          var reformattedDate =
            dateComponents[2] +
            "-" +
            dateComponents[1] +
            "-" +
            dateComponents[0];
          return {
            datetime: reformattedDate,
            open: item.nav,
            high: item.nav,
            low: item.nav,
            close: item.nav,
            volume: item.nav,
            previous_close: item.nav,
            date: new Date(reformattedDate).getTime() / 1000,
            value: +item.nav * +asset.quantity * multiplier,
          };
        });

        const filteredHistoricalValues = historicalValues.filter(
          (item) => item.date >= firstTransactionDate
        );

        const sortedHistoricalValues = filteredHistoricalValues.sort(
          (a, b) => a.date - b.date
        );
        const data: THistoricalData = {
          values: sortedHistoricalValues,
          assetId: asset.id,
          assetType: asset.category,
          assetSymbol: asset.symbol,
        };

        historicalData.push(data);
      }
    }

    return historicalData;
  } catch (err) {
    console.error("Error fetching historical data:", err);
    return [];
  }
};
