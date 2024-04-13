import { prisma } from "@/lib/prisma";
import { decryptObjectValues } from "@/lib/dataSecurity";
import {
  SIA_API_URL,
  ENCRYPTION_KEY,
  USE_SIA,
  DATABASE_URL,
} from "@/constants/env";
import {
  deleteAssetForUserInSia,
  getDecryptedAssetsFromSia,
} from "@/services/thirdParty/sia";
import { TAsset } from "@/lib/types";
import { fetchQuoteFromApi } from "@/services/thirdParty/twelveData";

// wrap this in try catcch
export const getDeccryptedAssetsByUserId = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const encryptionKey =
    user?.id.slice(0, 4) + ENCRYPTION_KEY + user?.id.slice(-4);

  if (DATABASE_URL) {
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
  } else if (USE_SIA) {
    const assets = await getDecryptedAssetsFromSia();
    return assets || [];
  } else {
    throw new Error("Neither DATABASE_URL nor USE_SIA is configured.");
  }
};

export const getAssetsQuoteFromApi = async (assets: any): Promise<TAsset[]> => {
  return Promise.all(assets.map(fetchQuoteFromApi));
};

export const deleteAssetByIdAndUserId = async (
  assetId: string,
  userId: string
): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  try {
    if (USE_SIA) {
      await deleteAssetForUserInSia(assetId, userId);
    }
    if (DATABASE_URL) {
      await prisma.asset.delete({
        where: { id: assetId, userId },
      });
    }
    return true;
  } catch {
    return false;
  }
};
