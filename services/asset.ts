import { prisma } from "@/lib/prisma";
import { decryptObjectValues } from "@/lib/dataSecurity";
import { SIA_API_URL, ENCRYPTION_KEY } from "@/constants/env";
import { getAllAssets } from "@/services/thirdParty/sia";
import { TAsset } from "@/lib/types";
import { fetchQuoteFromApi } from "@/services/thirdParty/twelveData";

// wrap this in try catcch
export const getAssetsByUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const encryptionKey =
    user?.id.slice(0, 4) + ENCRYPTION_KEY + user?.id.slice(-4);

  if (SIA_API_URL) {
    const assets = await getAllAssets();
    return assets || [];
  }
  let assets = await prisma.asset.findMany({
    where: {
      userId: user.id,
    },
    include: {
      transactions: true,
      assetPriceUpdates: true,
    },
  });

  assets = decryptObjectValues(assets, encryptionKey);
  return assets || [];
};

export const getAssetsQuoteFromApi = async (assets: any): Promise<TAsset[]> => {
  return Promise.all(assets.map(fetchQuoteFromApi));
};
