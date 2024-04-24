import { prisma } from "@/lib/prisma";
import { decryptObjectValues } from "@/lib/dataSecurity";
import { ENCRYPTION_KEY, USE_SIA, DATABASE_URL } from "@/constants/env";
import {
  deleteAssetForUserInSia,
  getDecryptedAssetsFromSia,
} from "@/services/thirdParty/sia";
import {
  TAsset,
  THistoricalData,
  TTwelveDataInstrumentQuote,
} from "@/types/types";
import {
  fetchQuoteFromTwelveData,
  getAssetQuoteFromTwelveDataBySymbol,
  getHistoricalDataFromTwelveData,
} from "@/services/thirdParty/twelveData";
import {
  fetchQuoteFromMFApi,
  getAssetQuoteFromMFApiBySymbol,
  getHistoricalDataFromMFApid,
} from "./thirdParty/mfapi";
import {
  fetchQuoteForManualAsset,
  getHistoricalDataForManualAssets,
} from "./thirdParty/manual";

export const getDeccryptedAssetsByUserId = async (id: string) => {
  try {
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
  } catch (err) {
    console.error("Error in getDecryptedAssetsByUserId: " + id + err);
    return null;
  }
};

export const getAssetsQuoteFromApi = async (assets: any): Promise<TAsset[]> => {
  try {
    const dataFromTwelveData = await Promise.all(
      assets
        .filter((asset: TAsset) => asset.source === "twelveData")
        .map(fetchQuoteFromTwelveData)
    );
    const dataFromMFApi = await Promise.all(
      assets
        .filter((asset: TAsset) => asset.source === "mfapi")
        .map(fetchQuoteFromMFApi)
    );
    const dataForManualAsset = await Promise.all(
      assets
        .filter((asset: TAsset) => asset.source === "manual")
        .map(fetchQuoteForManualAsset)
    );

    const data = [
      ...dataFromTwelveData,
      ...dataFromMFApi,
      ...dataForManualAsset,
    ];
    // const uniqueData = removeDuplicates(data);
    return data;
  } catch (err) {
    console.error("Error in getAssetsQuoteFromApi: " + err);
    return [];
  }
};

export const deleteAssetByIdAndUserId = async (
  assetId: string,
  userId: string
): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    if (USE_SIA) {
      await deleteAssetForUserInSia(assetId, userId);
    }
    if (DATABASE_URL) {
      await prisma.asset.delete({
        where: { id: assetId, userId },
      });
    }
    return true;
  } catch (err) {
    console.error("Error in deleteAssetByIdAndUserId: " + userId + err);
    return false;
  }
};

export const getAssetQuoteBySymbol = async ({
  symbol,
  source,
}: {
  symbol: string;
  source: string;
}): Promise<TTwelveDataInstrumentQuote | null> => {
  let assetQuote: TTwelveDataInstrumentQuote | null;
  switch (source) {
    case "twelveData":
      assetQuote = await getAssetQuoteFromTwelveDataBySymbol(symbol);
      return assetQuote;
    case "mfapi":
      assetQuote = await getAssetQuoteFromMFApiBySymbol(symbol);
      if (!assetQuote) {
        assetQuote = await getAssetQuoteFromTwelveDataBySymbol(symbol);
      }
      return assetQuote;
    default:
      return null;
  }
};

export const getHistoricalData = async ({
  userId,
  assets,
}: {
  userId: string;
  assets: TAsset[];
}): Promise<THistoricalData[]> => {
  const filteredAssets = assets.reduce(
    (acc, asset) => {
      if (asset.source === "twelveData") {
        acc.twelveDataAssets.push(asset);
      } else if (asset.source === "mfapi") {
        acc.mfapiAssets.push(asset);
      } else if (asset.source === "manual") {
        acc.manualAssets.push(asset);
      }
      return acc;
    },
    { twelveDataAssets: [], mfapiAssets: [], manualAssets: [] } as {
      twelveDataAssets: TAsset[];
      mfapiAssets: TAsset[];
      manualAssets: TAsset[];
    }
  );

  const twelveDataAssetsHistoricalData = await getHistoricalDataFromTwelveData(
    userId,
    filteredAssets.twelveDataAssets
  );

  const mfapiAssetsHistoricalData = await getHistoricalDataFromMFApid(
    userId,
    filteredAssets.mfapiAssets
  );
  const manualAssetsHistoricalData = await getHistoricalDataForManualAssets(
    userId,
    filteredAssets.manualAssets
  );

  // combine all historical data
  const historicalData = [
    ...twelveDataAssetsHistoricalData,
    ...mfapiAssetsHistoricalData,
    ...manualAssetsHistoricalData,
  ];

  historicalData.forEach((obj) => {
    let prices = obj.values;
    let lastNonNullValue = 0;

    // Backward pass: replace null values with the nearest non-null value preceding them
    for (let i = prices.length - 1; i >= 0; i--) {
      if (prices[i].value) {
        lastNonNullValue = prices[i].value;
      } else if (lastNonNullValue !== 0) {
        prices[i].value = lastNonNullValue;
      }
    }

    // Forward pass: replace null values with the nearest non-null value following them
    lastNonNullValue = 0;
    for (let i = 0; i < prices.length; i++) {
      if (prices[i].value) {
        lastNonNullValue = prices[i].value;
      } else if (lastNonNullValue !== 0) {
        prices[i].value = lastNonNullValue;
      }
    }
  });

  return historicalData;
};
