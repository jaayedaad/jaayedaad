"use server";

import { authOptions } from "@/lib/authOptions";
import { findTopMatchingAssets, transformToResultFormat } from "@/lib/helper";
import { TTwelveDataResult } from "@/lib/types";
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
