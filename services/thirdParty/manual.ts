"use server";

import { prepareHistoricalDataForManualCategory } from "@/helper/manualAssetsHistoryMaker";
import { getConversionRate } from "./currency";
import { TAsset, THistoricalData } from "@/types/types";
import { calculateCurrentValue } from "@/lib/assetCalculation";

export const getHistoricalDataForManualAssets = async (
  userId: string,
  assets: TAsset[]
): Promise<THistoricalData[]> => {
  const conversionRate = await getConversionRate(userId);
  if (!conversionRate) {
    throw new Error("Error fetching conversion rate");
  }
  const manualAssetHistory = prepareHistoricalDataForManualCategory(
    assets,
    conversionRate
  );

  return manualAssetHistory;
};

export const fetchQuoteForManualAsset = async (
  asset: TAsset
): Promise<TAsset> => {
  try {
    const updatedAsset = calculateCurrentValue(asset);
    return updatedAsset;
  } catch (error) {
    console.error("Error fetching quote:", error);
    return asset;
  }
};
