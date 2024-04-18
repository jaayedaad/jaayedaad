import { TAsset, TUnrealisedProfitLoss } from "@/types/types";

export const getAssetTableData = async (
  assets: TAsset[],
  unrealisedProfitLossArray: TUnrealisedProfitLoss[]
): Promise<
  {
    interval: string;
    data: TAsset[];
  }[]
> => {
  const intervals = ["1d", "1w", "1m", "1y", "All"];

  const assetTableData = intervals.map((interval) => {
    const updatedAssetsToView = assets.map((asset) => {
      const matchingIntervalData = unrealisedProfitLossArray.find(
        (data) => data.symbol === asset.symbol && data.interval === interval
      );

      if (matchingIntervalData) {
        return {
          ...asset,
          valueAtInterval: +matchingIntervalData.valueAtInterval,
          compareValue: +matchingIntervalData.compareValue,
        };
      }
      return asset;
    });

    return { interval: interval, data: updatedAssetsToView };
  });

  return assetTableData;
};
