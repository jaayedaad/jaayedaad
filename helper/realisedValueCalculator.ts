import { Asset } from "@/actions/getAssetsAction";

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
        realisedProfitLoss +=
          (+transaction.price - +transaction.avgBuyPrice) *
          +transaction.quantity;
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
