import { Asset } from "@/actions/getAssetsAction";
import {
  calculateTotalQuantity,
  calculateTotalValue,
} from "./transactionValueCalculator";

// Function to calculate realized profit/loss for each asset
export function calculateRealisedProfitLoss(assets: Asset[] | undefined) {
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
          (+transaction.price - avgBuyPrice) * +transaction.quantity;
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
