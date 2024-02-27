import { Asset } from "@/actions/getAssetsAction";
import {
  calculateTotalQuantity,
  calculateTotalValue,
} from "./transactionValueCalculator";
import { Transaction } from "@prisma/client";

export interface ProfitLoss {
  interval: string;
  realisedProfitLoss: string;
}

// Function to make realized profit/loss array based on interval
export function calculateRealisedProfitLoss(
  assets: Asset[] | undefined,
  conversionRate: string
): ProfitLoss[] {
  const realisedProfitsLosses: ProfitLoss[] = [];

  if (!assets) {
    return realisedProfitsLosses;
  }

  const intervals = [
    { label: "1d", days: 1 },
    { label: "1w", days: 7 },
    { label: "1m", days: 30 },
    { label: "1y", days: 365 },
  ];

  intervals.forEach(({ label, days }) => {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - days);

    let realisedProfitLoss = 0;

    assets.forEach((asset) => {
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
            (asset.buyCurrency === "USD" ? +conversionRate : 1);
        }
      });
    });

    realisedProfitsLosses.push({
      interval: label,
      realisedProfitLoss: realisedProfitLoss.toFixed(2),
    });
  });

  realisedProfitsLosses.push({
    interval: "All",
    realisedProfitLoss: calculateRealisedProfitLossAll(
      assets,
      conversionRate
    ).toString(),
  });

  return realisedProfitsLosses;
}

// Function to calculate realized profit/loss for each asset
function calculateRealisedProfitLossAll(
  assets: Asset[] | undefined,
  conversionRate: string
) {
  const realisedProfitsLosses: {
    id: string;
    realisedProfitLoss: string;
  }[] = [];

  assets?.forEach((asset) => {
    // Initialize quantities for buy and sell transactions
    let realisedProfitLoss = 0;

    asset.transactions.forEach((transaction) => {
      if (transaction.type === "sell") {
        const sortedTransactions = asset.transactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const pastTransactions = sortedTransactions.filter(
          (pastTransaction) => {
            const transactionDateToCompare = new Date(pastTransaction.date);
            return transactionDateToCompare < new Date(transaction.date);
          }
        );
        let avgBuyPrice: number;
        if (asset.symbol) {
          const valueTillTransaction = calculateTotalValue(pastTransactions);
          const quantityTillTransaction =
            calculateTotalQuantity(pastTransactions);

          avgBuyPrice = valueTillTransaction / quantityTillTransaction;
        } else {
          avgBuyPrice = +asset.buyPrice;
        }
        realisedProfitLoss +=
          (+transaction.price - avgBuyPrice) *
          +transaction.quantity *
          (asset.buyCurrency === "USD" ? +conversionRate : 1);
      }
    });

    realisedProfitsLosses.push({
      id: asset.id,
      realisedProfitLoss: realisedProfitLoss.toFixed(2),
    });
  });

  const value = realisedProfitsLosses?.reduce((acc, current) => {
    return acc + parseFloat(current.realisedProfitLoss);
  }, 0);

  return value;
}

function calculateAverageBuyPrice(
  asset: Asset,
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
