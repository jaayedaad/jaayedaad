import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import getAllTransactions from "../../sia/getAllTransactions";
import CryptoJS from "crypto-js";
import getAllPriceUpdates from "@/helper/sia/findAllPriceUpdates";
import { TAsset, TSiaObject } from "@/lib/types";

export async function getAllAssets() {
  const session = await getServerSession(authOptions);
  const username = "username";
  const password = "1234";
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
        user.id.slice(0, 4) +
        process.env.SIA_ENCRYPTION_KEY +
        user.id.slice(-4);

      const res = await fetch(
        `${process.env.SIA_API_URL}/worker/objects/${user.id}/assets/`,
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
          fetch(`${process.env.SIA_API_URL}/worker/objects${address}data`, {
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
  const username = "username";
  const password = "1234";
  const basicAuth =
    "Basic " + Buffer.from(username + ":" + password).toString("base64");

  await fetch(
    `${process.env.SIA_API_URL}/worker/objects/${userId}?batch=true`,
    {
      method: "DELETE",
      headers: {
        Authorization: basicAuth,
      },
    }
  );
};
