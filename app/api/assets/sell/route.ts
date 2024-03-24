import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { canSellAssets } from "@/helper/canSellAssets";
import getAllAssets from "@/sia/getAllAssets";
import {
  Asset as PrismaAsset,
  AssetPriceUpdate,
  Transaction,
} from "@prisma/client";
import { Asset } from "@/actions/getAssetsAction";
import CryptoJS from "crypto-js";
import { createId } from "@paralleldrive/cuid2";
import { getAssetById } from "@/sia/getAssetById";
import {
  decryptObjectValues,
  encryptDataValue,
  encryptObjectValues,
} from "@/utils/dataSecurity";

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
    const username = "username";
    const password = "1234";
    const basicAuth =
      "Basic " + Buffer.from(username + ":" + password).toString("base64");

    const encryptionKey =
      user.id.slice(0, 4) + process.env.SIA_ENCRYPTION_KEY + user.id.slice(-4);
    let ownedAsset: AssetWithTransaction[] | Asset[] | undefined;
    if (process.env.SIA_API_URL) {
      const userAssets = await getAllAssets();
      ownedAsset = userAssets?.filter(
        (asset) => asset.name === sellRequest.name
      );
    } else if (process.env.DATABASE_URL) {
      const userAssets = decryptObjectValues(
        user.assets,
        encryptionKey
      ) as typeof user.assets;
      ownedAsset = userAssets.filter(
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
          // Parsing decrypted data
          const assetToSell = await getAssetById(user.id, asset.id);

          // set asset quantity to 0 if sell quantiy is same as asset quantity
          if (+asset.quantity - +sellQuantity == 0) {
            if (process.env.SIA_API_URL) {
              // update asset
              await fetch(
                `${process.env.SIA_API_URL}/worker/objects/${user.id}/assets/${assetToSell.id}/data`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: basicAuth,
                  },
                  body: JSON.stringify({
                    data: CryptoJS.AES.encrypt(
                      JSON.stringify({
                        ...assetToSell,
                        quantity: "0",
                      }),
                      encryptionKey
                    ).toString(),
                  }),
                }
              );
            }
            if (process.env.DATABASE_URL) {
              // update asset
              await prisma.asset.update({
                where: {
                  id: asset.id,
                },
                data: {
                  quantity: encryptDataValue("0", encryptionKey),
                },
              });
            }
          }
          // Update asset quantity if asset quantity is greater than sell quantity
          else if (+asset.quantity - +sellQuantity > 0) {
            if (process.env.SIA_API_URL) {
              // update asset's quantity
              await fetch(
                `${process.env.SIA_API_URL}/worker/objects/${user.id}/assets/${assetToSell.id}/data`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: basicAuth,
                  },
                  body: JSON.stringify({
                    data: CryptoJS.AES.encrypt(
                      JSON.stringify({
                        ...assetToSell,
                        quantity: (+asset.quantity - +sellQuantity).toString(),
                      }),
                      encryptionKey
                    ).toString(),
                  }),
                }
              );
            }
            if (process.env.DATABASE_URL) {
              // update asset's quantity
              await prisma.asset.update({
                where: {
                  id: asset.id,
                },
                data: {
                  quantity: encryptDataValue(
                    (+asset.quantity - +sellQuantity).toString(),
                    encryptionKey
                  ),
                },
              });
            }
          }

          // make transaction
          if (process.env.SIA_API_URL) {
            // make transaction
            await fetch(
              `${process.env.SIA_API_URL}/worker/objects/${user.id}/assets/${assetToSell.id}/transactions/${transactionId}`,
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
                      quantity: sellQuantity,
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
          if (process.env.DATABASE_URL) {
            // encrypt data
            const encryptedData: {
              id: string;
              date: string;
              quantity: string;
              price: string;
              type: string;
              assetId: string;
            } = encryptObjectValues(
              {
                id: transactionId,
                date: sellRequest.date,
                quantity: sellQuantity,
                price: sellRequest.price,
                type: "sell",
                assetId: asset.id,
              },
              encryptionKey
            );
            // make transaction
            await prisma.transaction.create({
              data: encryptedData,
            });
          }
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
