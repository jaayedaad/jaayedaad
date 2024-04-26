import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import getAllTransactions from "@/helper/sia/getAllTransactions";
import CryptoJS from "crypto-js";
import { Worker } from "@siafoundation/renterd-js";
import getAllPriceUpdates from "@/helper/sia/findAllPriceUpdates";
import { TAsset, TSiaObject } from "@/types/types";
import {
  ENCRYPTION_KEY,
  SIA_ADMIN_PASSWORD,
  SIA_ADMIN_USERNAME,
  SIA_API_URL,
} from "@/constants/env";

export async function getDecryptedAssetsFromSia() {
  const session = await getServerSession(authOptions);
  const username = SIA_ADMIN_USERNAME;
  const password = SIA_ADMIN_PASSWORD;
  const basicAuth =
    "Basic " + Buffer.from(username + ":" + password).toString("base64");
  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user.email!,
      },
    });
    if (user) {
      const encryptionKey =
        user.id.slice(0, 4) + ENCRYPTION_KEY + user.id.slice(-4);

      const res = await fetch(
        `${SIA_API_URL}/worker/objects/${user.id}/assets/`,
        {
          method: "GET",
          headers: {
            Authorization: basicAuth,
          },
        }
      );

      if (res.ok) {
        const response: TSiaObject[] = await res.json();
        const assetAddressArray = response.map((res: TSiaObject) => res.name);

        const requests = assetAddressArray.map((address) =>
          fetch(`${SIA_API_URL}/worker/objects${address}data`, {
            method: "GET",
            headers: {
              Authorization: basicAuth,
            },
          }).then((response) => response.json())
        );

        const responses = await Promise.all(requests);

        const assetsWithTransactions = await Promise.all(
          responses.map(async (response) => {
            try {
              const encryptedData = response.data;

              // Decrypting the encrypted data
              const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
              const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

              // Parsing decrypted data
              const asset = JSON.parse(decryptedData);

              // get transactions for this asset
              const transactions = await getAllTransactions(asset.id);
              // Add transactions to the asset object
              asset.transactions = transactions;

              // get priceUpdates for this asset
              const assetPriceUpdates = await getAllPriceUpdates(asset.id);
              // Add asset price updates to the asset object
              if (assetPriceUpdates) {
                asset.assetPriceUpdates = assetPriceUpdates;
              } else {
                asset.assetPriceUpdates = [];
              }

              return asset;
            } catch (error) {
              return null; // or throw error if you want to stop the process entirely
            }
          })
        );

        // Filter out potential null values from errors
        const validAssets: TAsset[] = assetsWithTransactions.filter(
          (asset) => asset !== null
        );

        return validAssets;
      }
    }
  }
}

export const deleteUserInSia = async (userId: string) => {
  const username = SIA_ADMIN_USERNAME;
  const password = SIA_ADMIN_PASSWORD;
  const basicAuth =
    "Basic " + Buffer.from(username + ":" + password).toString("base64");

  await fetch(`${SIA_API_URL}/worker/objects/${userId}?batch=true`, {
    method: "DELETE",
    headers: {
      Authorization: basicAuth,
    },
  });
};

export const deleteAssetForUserInSia = async (
  assetId: string,
  userId: string
) => {
  try {
    const username = SIA_ADMIN_USERNAME;
    const password = SIA_ADMIN_PASSWORD;
    const basicAuth =
      "Basic " + Buffer.from(username + ":" + password).toString("base64");
    await fetch(
      `${SIA_API_URL}/worker/objects/${userId}/assets/${assetId}?batch=true`,
      {
        method: "DELETE",
        headers: {
          Authorization: basicAuth,
        },
      }
    );
    return true;
  } catch (err) {
    console.error("Error deleting asset from Sia: ", err);
    return false;
  }
};

export const uploadToSia = async ({
  data,
  path,
}: {
  data: string;
  path: string;
}) => {
  if (SIA_API_URL) {
    const worker = Worker({
      api: SIA_API_URL,
      password: SIA_ADMIN_PASSWORD,
    });

    await worker.objectUpload({
      params: {
        key: path,
        bucket: "default",
      },
      data: data,
    });
  }
};

export const downloadFromSia = async ({ path }: { path: string }) => {
  if (SIA_API_URL) {
    const worker = Worker({
      api: SIA_API_URL,
      password: SIA_ADMIN_PASSWORD,
    });

    const res = await worker.objectDownload({
      params: {
        key: path,
        bucket: "default",
      },
    });

    const downloadedObject = res.data as unknown as
      | TSiaObject[]
      | { data: string };

    return downloadedObject;
  }
};
