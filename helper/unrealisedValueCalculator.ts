import { Asset } from "@/actions/getAssetsAction";

// Function to calculate unrealized profit/loss for each asset
export function calculateUnrealisedProfitLoss(assets: Asset[]) {
  const value = (
    +assets?.reduce((acc, asset) => acc + (asset.currentValue || 0), 0) -
    +assets?.reduce((acc, asset) => acc + (asset.compareValue || 0), 0)
  ).toFixed(2);

  return parseFloat(value);
}
