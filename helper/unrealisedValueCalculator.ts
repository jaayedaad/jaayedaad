import { Asset } from "@/actions/getAssetsAction";

// Function to calculate unrealized profit/loss for each asset
export function calculateUnrealisedProfitLoss(assets: Asset[] | undefined) {
  const unrealisedProfitsLosses: {
    id: string;
    unrealisedProfitLoss: string;
  }[] = [];

  assets?.forEach((asset) => {
    const prevMarketValue = asset.currentValue;
    const totalCost = +asset.quantity * +asset.buyPrice;

    const unrealisedProfitLoss = (prevMarketValue - totalCost).toFixed(2);
    unrealisedProfitsLosses.push({ id: asset.id, unrealisedProfitLoss });
  });

  const value = unrealisedProfitsLosses?.reduce((acc, current) => {
    return acc + parseFloat(current.unrealisedProfitLoss);
  }, 0);

  return value;
}
