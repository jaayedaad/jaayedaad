import { TAsset, TConversionRates } from "@/lib/types";
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
export function calculateUnrealisedProfitLoss(assets: TAsset[]) {
  const value = (
    +assets.reduce((acc, asset) => {
      return acc + (asset.currentValue || 0);
    }, 0) -
    +assets.reduce((acc, asset) => {
      return acc + (asset.compareValue || 0);
    }, 0)
  ).toFixed(2);
  return parseFloat(value);
}

export function getUnrealisedProfitLossArray(
  historicalData: AssetHistory[],
  assets: TAsset[],
  conversionRates: TConversionRates
) {
  const results: {
    category: string;
    symbol: string;
    compareValue: string;
    valueAtInterval: number;
    currentValue: string;
    prevClose: string;
    interval: string;
    unrealisedProfitLoss: string;
  }[] = [];

  const intervals = [
    { label: "1d", days: 1 },
    { label: "1w", days: 6 },
    { label: "1m", days: 31 },
    { label: "1y", days: 365 },
    { label: "All", days: Infinity },
  ];

  intervals.forEach(({ label, days }) => {
    const latestDate = new Date(
      historicalData[0].values[historicalData[0].values.length - 1].date * 1000
    );
    const pastDate = new Date(latestDate);
    if (days !== Infinity) {
      pastDate.setDate(latestDate.getDate() - days);
    } else {
      pastDate.setTime(0);
    }

    assets.forEach((asset, index) => {
      const currencyConversionRate =
        1 / conversionRates[asset.buyCurrency.toLowerCase()];
      const transactions = asset.transactions.filter(
        (transaction) => new Date(transaction.date) <= pastDate
      );

      let quantityTillInterval: number = 0;

      if (transactions.length === 0 && asset.symbol) {
        quantityTillInterval = calculateTotalQuantity(asset.transactions);
      } else {
        quantityTillInterval = calculateTotalQuantity(transactions);
      }

      let assetHistory = historicalData[index];

      if (!asset.isManualEntry) {
        assetHistory = populateMissingDates(assetHistory);
      }

      const valueOfInterval = assetHistory.values.filter((value) => {
        return (
          new Date(pastDate.toDateString()).getTime() / 1000 <
          new Date(value.date).getTime()
        );
      });

      const result = {
        category: asset.category,
        symbol: asset.symbol,
        compareValue: (
          +asset.quantity *
          +asset.buyPrice *
          currencyConversionRate
        ).toFixed(2),
        currentValue:
          assetHistory.values[assetHistory.values.length - 1].value.toFixed(2),
        valueAtInterval: valueOfInterval[0].value,
        prevClose: valueOfInterval[0].close,
        interval: label,
        unrealisedProfitLoss: (
          assetHistory.values[assetHistory.values.length - 1].value -
          valueOfInterval[0].value
        ).toFixed(2),
      };

      results.push(result);
    });
  });

  return results;
}

function populateMissingDates(rawData: AssetHistory) {
  const values = rawData.values.sort((a, b) => a.date - b.date);
  const today = new Date(); // Get today's date

  // Populating missing dates between existing entries
  for (let i = 1; i < values.length; i++) {
    const currentDate = new Date(values[i].datetime);
    const previousDate = new Date(values[i - 1].datetime);

    const dayDiff =
      (currentDate.getTime() - previousDate.getTime()) / (1000 * 3600 * 24);

    if (dayDiff > 1) {
      for (let j = 1; j < dayDiff; j++) {
        const missingDate = new Date(previousDate);
        missingDate.setDate(previousDate.getDate() + j);

        if (
          !values.some(
            (entry) => entry.datetime === missingDate.toISOString().slice(0, 10)
          )
        ) {
          const newData = {
            datetime: missingDate.toISOString().slice(0, 10),
            open: values[i - 1].open,
            high: values[i - 1].high,
            low: values[i - 1].low,
            close: values[i - 1].close,
            volume: values[i - 1].volume,
            previous_close: values[i - 1].previous_close,
            date: Math.floor(missingDate.getTime() / 1000),
            value: values[i - 1].value,
          };

          values.splice(i + (j - 1), 0, newData);
        }
      }
    }
  }

  // Populating missing dates up to today's date
  const lastDate = new Date(values[values.length - 1].datetime);
  const daysUntilToday = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
  );

  if (daysUntilToday > 0) {
    for (let k = 1; k <= daysUntilToday; k++) {
      const missingDate = new Date(lastDate);
      missingDate.setDate(lastDate.getDate() + k);

      if (
        !values.some(
          (entry) => entry.datetime === missingDate.toISOString().slice(0, 10)
        )
      ) {
        const newData = {
          datetime: missingDate.toISOString().slice(0, 10),
          open: values[values.length - 1].open,
          high: values[values.length - 1].high,
          low: values[values.length - 1].low,
          close: values[values.length - 1].close,
          volume: values[values.length - 1].volume,
          previous_close: values[values.length - 1].previous_close,
          date: Math.floor(missingDate.getTime() / 1000),
          value: values[values.length - 1].value,
        };

        values.push(newData);
      }
    }
  }

  rawData.values = values.sort((a, b) => a.date - b.date);

  return rawData;
}
