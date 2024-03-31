"use server";
import { getAssetsByUser, getAssetsQuoteFromApi } from "@/services/asset";

export async function getAssets(email: string) {
  let assets = await getAssetsByUser(email);
  const quotedAssets = await getAssetsQuoteFromApi(assets);
  return quotedAssets;
}
