import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TAsset } from "../types/types";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const areDatesEqual = (date1: Date, date2: Date): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Set time components to 0 to ignore time
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  // Compare year, month, and day
  return d1.getTime() === d2.getTime();
};

export const capitalize = (inputStr: string) => {
  if (!inputStr) return "";
  return inputStr.charAt(0).toUpperCase() + inputStr.slice(1);
};

// Function to calculate similarity between search query and asset name
export function similarityScore(assetName: string, searchString: string) {
  const cleanAssetName = assetName.toLowerCase().trim();
  const cleanSearchString = searchString.toLowerCase().trim();

  // Check if the asset name includes the search query
  return cleanAssetName.includes(cleanSearchString) ? 100 : 0;
}

export function findTopMatchingAssets(assets: any, searchString: string) {
  // Calculate similarity between searchString and asset names
  const matchingAssets = assets.map((asset: any) => {
    const similarity = similarityScore(asset.name, searchString);
    return { ...asset, similarity };
  });

  // Filter out assets with 0 similarity
  const filteredAssets = matchingAssets.filter(
    (asset: any) => asset.similarity > 0
  );

  // Sort assets based on similarity score
  filteredAssets.sort((a: any, b: any) => b.similarity - a.similarity);

  // Return top matching asset if any
  return filteredAssets.slice(0, 1);
}

export function transformToResultFormat(
  topMatchingAssets: (TAsset & { similarity: number })[]
) {
  return topMatchingAssets.map((asset) => ({
    instrument_name: asset.name,
    symbol: asset.symbol || "", // If symbol is null, set it to an empty string
    instrument_type: asset.category,
    exchange: asset.exchange || "", // If exchange is null, set it to an empty string
    mic_code: "", // Not available in the database
    currency: asset.buyCurrency,
    country: "", // Not available in the database
    exchange_timezone: "", // Not available in the database
  }));
}

export const formatToLocaleString = (value: string | number) => {
  return Number(value).toLocaleString("en-IN");
};
