import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { canSellAssets } from "@/helper/canSellAssets";
import { getDecryptedAssetsFromSia } from "@/services/thirdParty/sia";
import {
  Asset as PrismaAsset,
  AssetPriceUpdate,
  Transaction,
} from "@prisma/client";
import { TAsset } from "@/lib/types";
import CryptoJS from "crypto-js";
import { createId } from "@paralleldrive/cuid2";
import { getAssetById } from "@/sia/getAssetById";
import {
  decryptObjectValues,
  encryptDataValue,
  encryptObjectValues,
} from "@/lib/dataSecurity";
import {
  DATABASE_URL,
  ENCRYPTION_KEY,
  SIA_ADMIN_PASSWORD,
  SIA_ADMIN_USERNAME,
  SIA_API_URL,
  USE_SIA,
} from "@/constants/env";

interface AssetWithTransaction extends PrismaAsset {
  transactions: Transaction[];
  assetPriceUpdates: AssetPriceUpdate[];
}

export async function PUT(req: Request) {
  const sellRequest: {
    name: string;
    quantity: string;
    price: string;
    date: string;
  } = await req.json();
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: {
      assets: {
        include: {
          transactions: true,
          assetPriceUpdates: true,
        },
      },
    },
  });

  if (user) {
    const encryptionKey =
      user.id.slice(0, 4) + ENCRYPTION_KEY + user.id.slice(-4);
    let ownedAsset: AssetWithTransaction[] | TAsset[] | undefined;

    if (DATABASE_URL) {
      const userAssets = decryptObjectValues(
        user.assets,
        encryptionKey
      ) as typeof user.assets;
      ownedAsset = userAssets.filter(
        (asset) => asset.name === sellRequest.name
      );
    } else if (USE_SIA) {
      const userAssets = await getDecryptedAssetsFromSia();
      ownedAsset = userAssets?.filter(
        (asset) => asset.name === sellRequest.name
      );
    }

    if (ownedAsset && ownedAsset.length > 0) {
      // Get the required asset
      const assets = ownedAsset;
      if (canSellAssets(sellRequest, assets[0].transactions)) {
        const transactionId = createId();
        let sellQuantity: string = sellRequest.quantity;

        for (const asset of assets) {
          // set asset quantity to 0 if sell quantiy is same as asset quantity
          if (+asset.quantity - +sellQuantity == 0) {
            await updateAssetQuantity(user.id, asset.id, "0", encryptionKey);
          }
          // Update asset quantity if asset quantity is greater than sell quantity
          else {
            const newQuantity = (+asset.quantity - +sellQuantity).toString();
            await updateAssetQuantity(
              user.id,
              asset.id,
              newQuantity,
              encryptionKey
            );
          }

          // make transaction
          await makeTransaction(
            user.id,
            asset.id,
            sellRequest,
            transactionId,
            encryptionKey
          );
        }

        return Response.json({ success: "Successfully sold asset" });
      } else {
        return Response.json({ error: "Not enough assets in account!" });
      }
    } else {
      return Response.json({ error: "You don't own this asset!" });
    }
  }

  return new Response("OK");
}

async function updateAssetQuantity(
  userId: string,
  assetId: string,
  newQuantity: string,
  encryptionKey: string
) {
  if (USE_SIA) {
    const basicAuth =
      "Basic " +
      Buffer.from(`${SIA_ADMIN_USERNAME}:${SIA_ADMIN_PASSWORD}`).toString(
        "base64"
      );
    const assetToSell = await getAssetById(userId, assetId);
    // update asset's quantity
    await fetch(
      `${SIA_API_URL}/worker/objects/${userId}/assets/${assetToSell.id}/data`,
      {
        method: "PUT",
        headers: {
          Authorization: basicAuth,
        },
        body: JSON.stringify({
          data: CryptoJS.AES.encrypt(
            JSON.stringify({
              ...assetToSell,
              quantity: newQuantity,
            }),
            encryptionKey
          ).toString(),
        }),
      }
    );
  }
  if (DATABASE_URL) {
    // update asset's quantity
    await prisma.asset.update({
      where: {
        id: assetId,
      },
      data: {
        quantity: encryptDataValue(newQuantity, encryptionKey),
      },
    });
  }
}

async function makeTransaction(
  userId: string,
  assetId: string,
  sellRequest: {
    name: string;
    quantity: string;
    price: string;
    date: string;
  },
  transactionId: string,
  encryptionKey: string
) {
  if (USE_SIA) {
    const basicAuth =
      "Basic " +
      Buffer.from(`${SIA_ADMIN_USERNAME}:${SIA_ADMIN_PASSWORD}`).toString(
        "base64"
      );
    const assetToSell = await getAssetById(userId, assetId);
    // make transaction
    await fetch(
      `${SIA_API_URL}/worker/objects/${userId}/assets/${assetToSell.id}/transactions/${transactionId}`,
      {
        method: "PUT",
        headers: {
          Authorization: basicAuth,
        },
        body: JSON.stringify({
          data: CryptoJS.AES.encrypt(
            JSON.stringify({
              id: transactionId,
              date: sellRequest.date,
              quantity: sellRequest.quantity,
              price: sellRequest.price,
              type: "sell",
              assetId: assetToSell.id,
            }),
            encryptionKey
          ).toString(),
        }),
      }
    );
  }
  if (DATABASE_URL) {
    // encrypt data
    const encryptedData: Transaction = encryptObjectValues(
      {
        id: transactionId,
        date: sellRequest.date,
        quantity: sellRequest.quantity,
        price: sellRequest.price,
        type: "sell",
        assetId: assetId,
      },
      encryptionKey
    );
    // make transaction
    await prisma.transaction.create({
      data: encryptedData,
    });
  }
}
