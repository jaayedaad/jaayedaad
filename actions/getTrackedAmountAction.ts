"use server";

import { prisma } from "@/lib/prisma";
import { decryptObjectValues } from "@/utils/dataSecurity";

export async function getTrackedAmount() {
  const encryptedAssets = await prisma.asset.findMany();
  let total = 0;

  for (const asset of encryptedAssets) {
    const secretKey =
      asset.userId.slice(0, 4) +
      process.env.SIA_ENCRYPTION_KEY +
      asset.userId.slice(-4);
    const decryptedAsset = decryptObjectValues(
      asset,
      secretKey
    ) as typeof asset;
    total += +decryptedAsset.buyPrice * +decryptedAsset.quantity;
  }

  return total;
}
