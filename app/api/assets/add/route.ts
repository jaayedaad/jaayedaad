import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { calculateAvgBuyPrice } from "@/helper/transactionValueCalculator";
import { Asset, Transaction } from "@prisma/client";
import CryptoJS from "crypto-js";
import { createId } from "@paralleldrive/cuid2";
import findExistingAssetFromSia from "@/helper/sia/findExisitingAsset";
import findExistingCategoryFromSia from "@/helper/sia/findExisitingCategory";
import getAllTransactions from "@/sia/getAllTransactions";
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
} from "@/constants/env";

export async function POST(req: Request) {
  const assetId = createId();
  const transactionId = createId();
  const assetPriceUpdateId = createId();

  let body = await req.json();
  const session = await getServerSession(authOptions);

  const rawUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: {
      assets: {
        include: {
          transactions: true,
        },
      },
      usersManualCategories: true,
    },
  });

  if (rawUser) {
    const encryptionKey =
      rawUser.id.slice(0, 4) + ENCRYPTION_KEY + rawUser.id.slice(-4);

    // decrypt the user data
    const user = {
      ...rawUser,
      assets: decryptObjectValues(
        rawUser.assets,
        encryptionKey
      ) as typeof rawUser.assets,
      usersManualCategories: decryptObjectValues(
        rawUser.usersManualCategories,
        encryptionKey
      ) as typeof rawUser.usersManualCategories,
    };

    if (SIA_API_URL) {
      const existingAsset = await findExistingAssetFromSia(
        user.id,
        body.symbol,
        body.name,
        body.isManualEntry
      );
      const username = SIA_ADMIN_USERNAME;
      const password = SIA_ADMIN_PASSWORD;
      const basicAuth =
        "Basic " + Buffer.from(username + ":" + password).toString("base64");

      const res = await fetch(
        `${SIA_API_URL}/workers/object/${user.id}/assets`,
        {
          method: "GET",
        }
      );
      const existingCategoryId = await findExistingCategoryFromSia(
        user.id,
        body.type
      );
      if (!existingAsset) {
        if (body.isManualEntry) {
          if (existingCategoryId) {
            // add asset to sia
            fetch(
              `${SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}/data`,
              {
                method: "PUT",
                headers: {
                  Authorization: basicAuth,
                },
                body: JSON.stringify({
                  data: CryptoJS.AES.encrypt(
                    JSON.stringify({
                      ...body,
                      id: assetId,
                      userId: user.id,
                      symbol: null,
                      manualCategoryId: existingCategoryId,
                    }),
                    encryptionKey
                  ).toString(),
                }),
              }
            ).then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            });
          } else {
            // create a new category
            const manualCategoryId = createId();
            await fetch(
              `${SIA_API_URL}/worker/objects/${user.id}/usersManualCategories/${manualCategoryId}/data`,
              {
                method: "PUT",
                headers: {
                  Authorization: basicAuth,
                },
                body: JSON.stringify({
                  data: CryptoJS.AES.encrypt(
                    JSON.stringify({
                      id: manualCategoryId,
                      icon: body.icon,
                      name: body.type,
                      userId: user.id,
                    }),
                    encryptionKey
                  ).toString(),
                }),
              }
            );

            // add asset to sia
            await fetch(
              `${SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}/data`,
              {
                method: "PUT",
                headers: {
                  Authorization: basicAuth,
                },
                body: JSON.stringify({
                  data: CryptoJS.AES.encrypt(
                    JSON.stringify({
                      ...body,
                      id: assetId,
                      userId: user.id,
                      symbol: null,
                      manualCategoryId: manualCategoryId,
                    }),
                    encryptionKey
                  ).toString(),
                }),
              }
            );
          }

          await fetch(
            `${SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}/assetPriceUpdates/${assetPriceUpdateId}`,
            {
              method: "PUT",
              headers: {
                Authorization: basicAuth,
              },
              body: JSON.stringify({
                data: CryptoJS.AES.encrypt(
                  JSON.stringify({
                    id: assetPriceUpdateId,
                    assetId: assetId,
                    price: body.currentPrice,
                    date: body.buyDate,
                  }),
                  encryptionKey
                ).toString(),
              }),
            }
          );
        } else {
          // add asset to sia
          fetch(
            `${SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}/data`,
            {
              method: "PUT",
              headers: {
                Authorization: basicAuth,
              },
              body: JSON.stringify({
                data: CryptoJS.AES.encrypt(
                  JSON.stringify({
                    ...body,
                    id: assetId,
                    userId: user.id,
                  }),
                  encryptionKey
                ).toString(),
              }),
            }
          ).then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
          });
        }
        // add asset's transaction to sia
        fetch(
          `${SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}/transactions/${transactionId}`,
          {
            method: "PUT",
            headers: {
              Authorization: basicAuth,
            },
            body: JSON.stringify({
              data: CryptoJS.AES.encrypt(
                JSON.stringify({
                  id: transactionId,
                  date: body.buyDate,
                  quantity: body.quantity,
                  price: body.buyPrice,
                  type: "buy",
                  assetId: assetId,
                }),
                encryptionKey
              ).toString(),
            }),
          }
        ).then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        });
      } else {
        const updatedQuantity = +existingAsset.quantity + +body.quantity;
        const transaction: Transaction = {
          id: transactionId,
          date: body.buyDate,
          quantity: body.quantity,
          price: body.buyPrice,
          type: "buy",
          assetId: existingAsset.id,
        };
        // add asset's transaction to sia
        fetch(
          `${SIA_API_URL}/worker/objects/${user.id}/assets/${existingAsset.id}/transactions/${transactionId}`,
          {
            method: "PUT",
            headers: {
              Authorization: basicAuth,
            },
            body: JSON.stringify({
              data: CryptoJS.AES.encrypt(
                JSON.stringify(transaction),
                encryptionKey
              ).toString(),
            }),
          }
        ).then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        });

        const existingAssetTransactions = await getAllTransactions(
          existingAsset.id
        );
        if (existingAssetTransactions) {
          existingAssetTransactions.push(transaction);

          const avgBuyPrice = calculateAvgBuyPrice(existingAssetTransactions);
          if (!body.isManualEntry) {
            // add asset to sia
            fetch(
              `${SIA_API_URL}/worker/objects/${user.id}/assets/${existingAsset.id}/data`,
              {
                method: "PUT",
                headers: {
                  Authorization: basicAuth,
                },
                body: JSON.stringify({
                  data: CryptoJS.AES.encrypt(
                    JSON.stringify({
                      ...existingAsset,
                      quantity: updatedQuantity.toString(),
                      buyPrice: avgBuyPrice.toString(),
                    }),
                    encryptionKey
                  ).toString(),
                }),
              }
            ).then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            });
          } else {
            // add asset to sia
            fetch(
              `${SIA_API_URL}/worker/objects/${user.id}/assets/${existingAsset.id}/data`,
              {
                method: "PUT",
                headers: {
                  Authorization: basicAuth,
                },
                body: JSON.stringify({
                  data: CryptoJS.AES.encrypt(
                    JSON.stringify({
                      ...existingAsset,
                      quantity: updatedQuantity.toString(),
                      buyPrice: avgBuyPrice.toString(),
                      currentPrice: body.currentPrice.toString(),
                    }),
                    encryptionKey
                  ).toString(),
                }),
              }
            ).then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            });

            await fetch(
              `${SIA_API_URL}/worker/objects/${user.id}/assets/${existingAsset.id}/assetPriceUpdates/${assetPriceUpdateId}`,
              {
                method: "PUT",
                headers: {
                  Authorization: basicAuth,
                },
                body: JSON.stringify({
                  data: CryptoJS.AES.encrypt(
                    JSON.stringify({
                      id: assetPriceUpdateId,
                      assetId: assetId,
                      price: body.currentPrice,
                      date: body.buyDate,
                    }),
                    encryptionKey
                  ).toString(),
                }),
              }
            );
            await fetch(
              `${SIA_API_URL}/worker/objects/${user.id}/assets/${existingAsset.id}/assetPriceUpdates/${assetPriceUpdateId}`,
              {
                method: "PUT",
                headers: {
                  Authorization: basicAuth,
                },
                body: JSON.stringify({
                  data: CryptoJS.AES.encrypt(
                    JSON.stringify({
                      id: assetPriceUpdateId,
                      assetId: existingAsset.id,
                      price: body.currentPrice,
                      date: body.buyDate,
                    }),
                    encryptionKey
                  ).toString(),
                }),
              }
            );
          }
        }
      }
    }
    if (DATABASE_URL) {
      const existingAsset = user?.assets.find((asset) => {
        if (asset.symbol) {
          return asset.symbol === body.symbol;
        } else {
          return asset.name === body.name;
        }
      });
      const manualEntry = body.isManualEntry;
      const assetType = body.type;
      // encrypt the body data
      body = encryptObjectValues(body, encryptionKey);
      if (!existingAsset) {
        let asset: Asset;
        if (manualEntry) {
          const existingCategory = user.usersManualCategories.find(
            (manualCategory) => manualCategory.name === assetType
          );

          if (existingCategory) {
            asset = await prisma.asset.create({
              data: {
                ...body,
                id: assetId,
                userId: user.id,
                manualCategoryId: existingCategory.id,
              },
            });
          } else {
            const manualCategoryId = createId();
            const usersManualCategory = await prisma.usersManualCategory.create(
              {
                data: {
                  id: manualCategoryId,
                  icon: body.icon,
                  name: body.type,
                  userId: user.id,
                },
              }
            );
            asset = await prisma.asset.create({
              data: {
                ...body,
                id: assetId,
                userId: user.id,
                manualCategoryId: usersManualCategory.id,
              },
            });
          }

          const assetPriceUpdate = await prisma.assetPriceUpdate.create({
            data: {
              id: assetPriceUpdateId,
              assetId: asset.id,
              price: body.currentPrice,
              date: body.buyDate,
            },
          });
        } else {
          asset = await prisma.asset.create({
            data: {
              ...body,
              id: assetId,
              userId: user.id,
            },
          });
        }
        await prisma.transaction.create({
          data: {
            id: transactionId,
            date: body.buyDate,
            quantity: body.quantity,
            price: body.buyPrice,
            type: "buy",
            assetId: asset.id,
          },
        });
      } else {
        const updatedQuantity = +existingAsset.quantity + +body.quantity;

        const newTransaction = await prisma.transaction.create({
          data: {
            id: transactionId,
            date: body.buyDate,
            quantity: body.quantity,
            price: body.buyPrice,
            type: "buy",
            assetId: existingAsset.id,
          },
        });

        // Calculate avg buy price after new transaction
        existingAsset.transactions.push(newTransaction);
        const avgBuyPrice = calculateAvgBuyPrice(existingAsset.transactions);

        if (!manualEntry) {
          const asset = await prisma.asset.update({
            where: {
              id: existingAsset.id,
            },
            data: {
              quantity: encryptDataValue(
                updatedQuantity.toString(),
                encryptionKey
              ),
              buyPrice: encryptDataValue(avgBuyPrice.toString(), encryptionKey),
            },
          });
        } else {
          const asset = await prisma.asset.update({
            where: {
              id: existingAsset.id,
            },
            data: {
              quantity: encryptDataValue(
                updatedQuantity.toString(),
                encryptionKey
              ),
              buyPrice: encryptDataValue(avgBuyPrice.toString(), encryptionKey),
              currentPrice: body.currentPrice.toString(),
            },
          });
          const assetPriceUpdate = await prisma.assetPriceUpdate.create({
            data: {
              id: assetPriceUpdateId,
              assetId: asset.id,
              price: body.currentPrice,
              date: body.buyDate,
            },
          });
        }
      }
    }

    return new Response("OK");
  }
}
