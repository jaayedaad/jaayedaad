import { TAsset } from "@/lib/types";
import { calculateTotalQuantity } from "./transactionValueCalculator";

type AssetHistory = {
  meta: {
    symbol: string;
    interval: string;
    currency: string;
    exchange_timezone: string;
    exchange: string;
    mic_code: string;
    type: string;
  };
  values: {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    previous_close: string;
    date: number;
    value: number;
  }[];
  status: string;
  assetType: string;
  assetSymbol: string;
};

// Function to calculate unrealized profit/loss for each asset
export function calculateUnrealisedProfitLoss(
  assets: TAsset[],
  conversionRates: {
    [currency: string]: number;
  }
) {
  const value = (
    +assets?.reduce((acc, asset) => {
      const assetCurrency = asset.buyCurrency.toLowerCase();
      const currencyConversion = conversionRates[assetCurrency];
      const multiplier = 1 / currencyConversion;
      return acc + (asset.currentValue * multiplier || 0);
    }, 0) -
    +assets?.reduce((acc, asset) => {
      const assetCurrency = asset.buyCurrency.toLowerCase();
      const currencyConversion = conversionRates[assetCurrency];
      const multiplier = 1 / currencyConversion;
      return acc + (asset.compareValue * multiplier || 0);
    }, 0)
  ).toFixed(2);
  return parseFloat(value);
}

export function getUnrealisedProfitLossArray(
  historicalData: AssetHistory[],
  assets: TAsset[],
  conversionRate: {
    [currency: string]: number;
  }
) {
  const results: {
    type: string;
    symbol: string;
    compareValue: string;
    currentValue: string;
    prevClose: string;
    interval: string;
    unrealisedProfitLoss: string;
  }[] = [];

  const intervals = [
    { label: "1d", days: 1 },
    { label: "1w", days: 7 },
    { label: "1m", days: 30 },
    { label: "1y", days: 365 },
  ];

  intervals.forEach(({ label, days }) => {
    const latestDate = new Date(
      historicalData[0].values[historicalData[0].values.length - 1].date * 1000
    );
    const pastDate = new Date(latestDate);
    pastDate.setDate(latestDate.getDate() - days);

    assets.forEach((asset) => {
      const assetCurrency = asset.buyCurrency.toLowerCase();
      const currencyConversion = conversionRate[assetCurrency];
      const multiplier = 1 / currencyConversion;
      const transactions = asset.transactions.filter(
        (transaction) => new Date(transaction.date) <= pastDate
      );

      let quantityTillInterval: number = 0;

      if (transactions.length === 0 && asset.symbol) {
        quantityTillInterval = calculateTotalQuantity(asset.transactions);
      } else {
        quantityTillInterval = calculateTotalQuantity(transactions);
      }

      if (asset.symbol) {
        const assetHistory = historicalData.filter(
          (history) => history.assetSymbol === asset.symbol
        );

        const populatedHistory = populateMissingDates(assetHistory[0]);
        const valueOfInterval = populatedHistory.values.filter((value) => {
          return (
            new Date(pastDate.toDateString()).getTime() / 1000 <
            new Date(value.date).getTime()
          );
        });

        const result = {
          type: asset.type,
          symbol: asset.symbol,
          compareValue: (
            quantityTillInterval *
            +asset.buyPrice *
            multiplier
          ).toFixed(2),
          currentValue: (
            parseFloat(
              transactions.length > 0
                ? valueOfInterval[0].close
                : valueOfInterval[valueOfInterval.length - 2].close
            ) *
            quantityTillInterval *
            multiplier
          ).toFixed(2),
          prevClose:
            transactions.length > 0
              ? valueOfInterval[0].close
              : valueOfInterval[valueOfInterval.length - 2].close,
          interval: label,
          unrealisedProfitLoss: (
            (parseFloat(
              transactions.length > 0
                ? valueOfInterval[0].close
                : valueOfInterval[valueOfInterval.length - 2].close
            ) -
              parseFloat(asset.buyPrice)) *
            quantityTillInterval *
            multiplier
          ).toFixed(2),
        };

        results.push(result);
      }
    });
  });

  return results;
}

function populateMissingDates(rawData: AssetHistory) {
  // Extract the values array from raw data
  const values = rawData.values.sort((a, b) => a.date - b.date);

  // Iterate through the values array to identify missing dates
  for (let i = 1; i < values.length; i++) {
    const currentDate = new Date(values[i].datetime);
    const previousDate = new Date(values[i - 1].datetime);

    // Calculate the difference in days between current and previous dates
    const dayDiff =
      (currentDate.getTime() - previousDate.getTime()) / (1000 * 3600 * 24);

    // If there is a gap of more than 1 day, populate missing dates
    if (dayDiff > 1) {
      for (let j = 1; j < dayDiff; j++) {
        const missingDate = new Date(previousDate);
        missingDate.setDate(previousDate.getDate() + j);

        // Create a new data object using data from the previous date
        const newData = {
          datetime: missingDate.toISOString().slice(0, 10), // Format date as YYYY-MM-DD
          open: values[i - 1].open,
          high: values[i - 1].high,
          low: values[i - 1].low,
          close: values[i - 1].close,
          volume: values[i - 1].volume,
          previous_close: values[i - 1].previous_close,
          date: Math.floor(missingDate.getTime() / 1000), // Convert date to timestamp
          value: values[i - 1].value,
        };

        // Insert the new data object into the values array at the appropriate position
        values.splice(i + (j - 1), 0, newData);
      }
    }
  }

  // Update rawData with the modified values array
  rawData.values = values.sort((a, b) => a.date - b.date);

  return rawData;
}
