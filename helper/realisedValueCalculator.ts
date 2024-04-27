import { TAsset, TProfitLoss } from "@/types/types";
import {
  calculateTotalQuantity,
  calculateTotalValue,
} from "./transactionValueCalculator";
import { Transaction } from "@prisma/client";

// Function to make realized profit/loss array based on interval
export function calculateRealisedProfitLoss(
  assets: TAsset[] | undefined,
  conversionRate: {
    [currency: string]: number;
  }
): TProfitLoss[] {
  const realisedProfitsLosses: TProfitLoss[] = [];

  if (!assets) {
    return realisedProfitsLosses;
  }

  const intervals = [
    { label: "1d", days: 1 },
    { label: "1w", days: 7 },
    { label: "1m", days: 30 },
    { label: "1y", days: 365 },
    { label: "All", days: Infinity },
  ];

  intervals.forEach(({ label, days }) => {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    if (days !== Infinity) {
      pastDate.setDate(currentDate.getDate() - days);
    } else {
      pastDate.setTime(0);
    }

    let realisedProfitLoss = 0;

    assets.forEach((asset) => {
      const assetCurrency = asset.buyCurrency.toLowerCase();
      const currencyConversion = conversionRate[assetCurrency];
      const multiplier = 1 / currencyConversion;
      const transactions = asset.transactions.filter(
        (transaction) =>
          new Date(transaction.date) >= pastDate &&
          new Date(transaction.date) <= currentDate
      );

      transactions.forEach((transaction) => {
        if (transaction.type === "sell") {
          const pastTransactionsBeforeSell = asset.transactions.filter(
            (t) => new Date(t.date) < new Date(transaction.date)
          );
          const avgBuyPrice = calculateAverageBuyPrice(
            asset,
            pastTransactionsBeforeSell
          );
          realisedProfitLoss +=
            (+transaction.price - avgBuyPrice) *
            +transaction.quantity *
            multiplier;
        }
      });
    });

    realisedProfitsLosses.push({
      interval: label,
      realisedProfitLoss: realisedProfitLoss.toFixed(2),
    });
  });

  return realisedProfitsLosses;
}

function calculateAverageBuyPrice(
  asset: TAsset,
  pastTransactions: Transaction[]
): number {
  if (asset.symbol) {
    const valueTillTransaction = calculateTotalValue(pastTransactions);
    const quantityTillTransaction = calculateTotalQuantity(pastTransactions);
    return quantityTillTransaction !== 0
      ? valueTillTransaction / quantityTillTransaction
      : 0;
  } else {
    return +asset.buyPrice;
  }
}
