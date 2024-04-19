import {
  TAsset,
  TConversionRates,
  TGroupedAssets,
  TUnrealisedProfitLoss,
} from "@/types/types";

export const getDashboardTableData = async (
  assets: TAsset[],
  intervalChangeData: TUnrealisedProfitLoss[],
  conversionRates: TConversionRates
): Promise<
  {
    interval: string;
    data: TGroupedAssets;
  }[]
> => {
  const intervals = ["1d", "1w", "1m", "1y", "All"];

  const dashboardTableData = intervals.map((interval) => {
    const groupedAssets: TGroupedAssets = [];

    const intervalData = intervalChangeData.filter(
      (data) => data.interval === interval
    );

    const intervalDataSumByType = intervalData.reduce(
      (
        accumulator: {
          [category: string]: number;
        },
        data
      ) => {
        const { category, valueAtInterval } = data;
        accumulator[category] = (accumulator[category] || 0) + valueAtInterval;
        return accumulator;
      },
      {}
    );

    assets.forEach((asset) => {
      if (asset.quantity !== "0") {
        const assetCurrency = asset.buyCurrency.toLowerCase();
        const currencyConversion = conversionRates[assetCurrency];
        const multiplier = 1 / currencyConversion;
        const existingType = groupedAssets.find(
          (data) => data.category === asset.category
        );

        if (existingType) {
          existingType.currentValue += asset.currentValue * multiplier;
          existingType.compareValue += asset.compareValue * multiplier;
          existingType.valueAtInterval += asset.valueAtInterval;
        } else {
          groupedAssets.push({
            category: asset.category,
            currentValue: asset.currentValue * multiplier,
            compareValue: asset.compareValue * multiplier,
            valueAtInterval: asset.valueAtInterval,
          });
        }
      }
    });
    if (intervalData && intervalData.length > 0) {
      groupedAssets.forEach((asset) => {
        asset.valueAtInterval =
          intervalDataSumByType[asset.category] !== undefined
            ? intervalDataSumByType[asset.category]
            : asset.valueAtInterval;
      });
    }

    return { interval: interval, data: groupedAssets };
  });

  return dashboardTableData;
};
