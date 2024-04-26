import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { calculateAvgBuyPrice } from "@/helper/transactionValueCalculator";
import { Asset, Transaction } from "@prisma/client";
import CryptoJS from "crypto-js";
import { createId } from "@paralleldrive/cuid2";
import findExistingAssetFromSia from "@/helper/sia/findExisitingAsset";
import findExistingCategoryFromSia from "@/helper/sia/findExisitingCategory";
import getAllTransactions from "@/helper/sia/getAllTransactions";
import {
  decryptObjectValues,
  encryptDataValue,
  encryptObjectValues,
} from "@/lib/dataSecurity";
import { DATABASE_URL, ENCRYPTION_KEY, USE_SIA } from "@/constants/env";
import { defaultCategories } from "@/constants/category";
import { uploadToSia } from "@/services/thirdParty/sia";

export async function POST(req: Request) {
  const assetId = createId();
  const transactionId = createId();
  const assetPriceUpdateId = createId();
  const manualCategoryId = createId();

  let { icon, ...body } = await req.json();

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

    if (USE_SIA) {
      const existingAsset = await findExistingAssetFromSia(
        user.id,
        body.symbol,
        body.name,
        body.source
      );

      const existingCategoryId = await findExistingCategoryFromSia(
        user.id,
        body.category
      );

      if (!existingAsset) {
        const belongsToDefaultCategory = defaultCategories.includes(
          body.category.toLowerCase()
        );
        if (body.source === "manual") {
          if (!belongsToDefaultCategory) {
            if (existingCategoryId) {
              // add asset to sia
              const data = JSON.stringify({
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
              });

              await uploadToSia({
                data: data,
                path: `${user.id}/assets/${assetId}/data`,
              });
            } else {
              // create a new category
              const manualCategory = JSON.stringify({
                data: CryptoJS.AES.encrypt(
                  JSON.stringify({
                    id: manualCategoryId,
                    icon: icon,
                    name: body.category,
                    userId: user.id,
                  }),
                  encryptionKey
                ).toString(),
              });

              await uploadToSia({
                data: manualCategory,
                path: `${user.id}/usersManualCategories/${manualCategoryId}/data`,
              });

              // add asset to sia
              const data = JSON.stringify({
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
              });

              await uploadToSia({
                data: data,
                path: `${user.id}/assets/${assetId}/data`,
              });
            }
          } else {
            // add asset to sia
            const data = JSON.stringify({
              data: CryptoJS.AES.encrypt(
                JSON.stringify({
                  ...body,
                  id: assetId,
                  userId: user.id,
                }),
                encryptionKey
              ).toString(),
            });

            await uploadToSia({
              data: data,
              path: `${user.id}/assets/${assetId}/data`,
            });
          }
          const priceUpdate = JSON.stringify({
            data: CryptoJS.AES.encrypt(
              JSON.stringify({
                id: assetPriceUpdateId,
                assetId: assetId,
                price: body.currentPrice,
                date: body.buyDate,
              }),
              encryptionKey
            ).toString(),
          });

          await uploadToSia({
            data: priceUpdate,
            path: `${user.id}/assets/${assetId}/assetPriceUpdates/${assetPriceUpdateId}`,
          });
        } else {
          // add asset to sia
          const data = JSON.stringify({
            data: CryptoJS.AES.encrypt(
              JSON.stringify({
                ...body,
                id: assetId,
                userId: user.id,
              }),
              encryptionKey
            ).toString(),
          });

          await uploadToSia({
            data: data,
            path: `${user.id}/assets/${assetId}/data`,
          });
        }
        // add asset's transaction to sia
        const data = JSON.stringify({
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
        });

        await uploadToSia({
          data: data,
          path: `${user.id}/assets/${assetId}/transactions/${transactionId}`,
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
        const data = JSON.stringify({
          data: CryptoJS.AES.encrypt(
            JSON.stringify(transaction),
            encryptionKey
          ).toString(),
        });

        await uploadToSia({
          data: data,
          path: `${user.id}/assets/${existingAsset.id}/transactions/${transactionId}`,
        });

        const existingAssetTransactions = await getAllTransactions(
          existingAsset.id
        );
        if (existingAssetTransactions) {
          existingAssetTransactions.push(transaction);

          const avgBuyPrice = calculateAvgBuyPrice(existingAssetTransactions);
          if (body.source !== "manual") {
            // add asset to sia
            const data = JSON.stringify({
              data: CryptoJS.AES.encrypt(
                JSON.stringify({
                  ...existingAsset,
                  quantity: updatedQuantity.toString(),
                  buyPrice: avgBuyPrice.toString(),
                }),
                encryptionKey
              ).toString(),
            });

            await uploadToSia({
              data: data,
              path: `${user.id}/assets/${existingAsset.id}/data`,
            });
          } else {
            // add asset to sia
            const data = JSON.stringify({
              data: CryptoJS.AES.encrypt(
                JSON.stringify({
                  ...existingAsset,
                  quantity: updatedQuantity.toString(),
                  buyPrice: avgBuyPrice.toString(),
                  currentPrice: body.currentPrice.toString(),
                }),
                encryptionKey
              ).toString(),
            });

            await uploadToSia({
              data: data,
              path: `${user.id}/assets/${existingAsset.id}/data`,
            });

            const priceUpdate = JSON.stringify({
              data: CryptoJS.AES.encrypt(
                JSON.stringify({
                  id: assetPriceUpdateId,
                  assetId: assetId,
                  price: body.currentPrice,
                  date: body.buyDate,
                }),
                encryptionKey
              ).toString(),
            });

            await uploadToSia({
              data: priceUpdate,
              path: `${user.id}/assets/${existingAsset.id}/assetPriceUpdates/${assetPriceUpdateId}`,
            });
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
      const manualEntry = body.source === "manual";
      const belongsToDefaultCategory = defaultCategories.includes(
        body.category.toLowerCase()
      );
      const assetType = body.category;
      // encrypt the body data
      if (!existingAsset) {
        body = encryptObjectValues(body, encryptionKey);
        let asset: Asset;
        if (manualEntry) {
          if (!belongsToDefaultCategory) {
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
              const usersManualCategory =
                await prisma.usersManualCategory.create({
                  data: {
                    id: manualCategoryId,
                    icon: icon,
                    name: body.category,
                    userId: user.id,
                  },
                });
              asset = await prisma.asset.create({
                data: {
                  ...body,
                  id: assetId,
                  userId: user.id,
                  manualCategoryId: usersManualCategory.id,
                },
              });
            }
          } else {
            asset = await prisma.asset.create({
              data: {
                ...body,
                id: assetId,
                userId: user.id,
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
        body = encryptObjectValues(body, encryptionKey);
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
        existingAsset.transactions.push(
          decryptObjectValues(newTransaction, encryptionKey)
        );
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
