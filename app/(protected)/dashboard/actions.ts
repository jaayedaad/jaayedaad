"use server";

import { ENCRYPTION_KEY } from "@/constants/env";
import { authOptions } from "@/lib/authOptions";
import { decryptObjectValues } from "@/lib/dataSecurity";
import { TAsset, TTwelveDataResult } from "@/lib/types";
import { getDeccryptedAssetsByUserId } from "@/services/asset";
import { getServerSession } from "next-auth";

export const searchResultsFromExistingAssetsInDatabaseAction = async (
  searchQuery: string
): Promise<TTwelveDataResult[]> => {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    throw new Error("User not found");
  }

  const assets = await getDeccryptedAssetsByUserId(session.user.id);
  const topMatchingAssets = findTopMatchingAssets(assets, searchQuery);

  // If there are no matching assets, return an empty array
  if (topMatchingAssets.length === 0) {
    return [];
  }

  return transformToResultFormat(topMatchingAssets);
};

// Function to calculate similarity between search query and asset name
function similarityScore(assetName: string, searchString: string) {
  const cleanAssetName = assetName.toLowerCase().trim();
  const cleanSearchString = searchString.toLowerCase().trim();

  // Check if the asset name includes the search query
  return cleanAssetName.includes(cleanSearchString) ? 100 : 0;
}

function findTopMatchingAssets(assets: any, searchString: string) {
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

function transformToResultFormat(
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
