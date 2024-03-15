import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { calculateAvgBuyPrice } from "@/helper/transactionValueCalculator";
import { Asset } from "@prisma/client";
import CryptoJS from "crypto-js";
import { createId } from "@paralleldrive/cuid2";
import findExistingAssetFromSia from "@/helper/sia/findExisitingAsset";
import findExistingCategoryFromSia from "@/helper/sia/findExisitingCategory";

export async function POST(req: Request) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
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

  if (user) {
    if (process.env.SIA_API_URL) {
      const existingAsset = await findExistingAssetFromSia(
        user.id,
        body.symbol,
        body.name,
        body.isManualEntry
      );
      const assetId = createId();
      const transactionId = createId();
      const username = "username";
      const password = "1234";
      const basicAuth =
        "Basic " + Buffer.from(username + ":" + password).toString("base64");

      const encryptionKey =
        user.id.slice(0, 4) +
        process.env.SIA_ENCRYPTION_KEY +
        user.id.slice(-4);

      const res = await fetch(
        `${process.env.SIA_API_URL}/workers/object/${user.id}/assets`,
        {
          method: "GET",
        }
      );
      if (!existingAsset) {
        if (body.isManualEntry) {
          const existingCategoryId = await findExistingCategoryFromSia(
            user.id,
            body.type
          );

          if (existingCategoryId) {
            // add asset to sia
            fetch(
              `${process.env.SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}/data`,
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
              `${process.env.SIA_API_URL}/worker/objects/${user.id}/usersManualCategories/data`,
              {
                method: "PUT",
                headers: {
                  Authorization: basicAuth,
                },
                body: JSON.stringify({
                  data: CryptoJS.AES.encrypt(
                    JSON.stringify({
                      id: manualCategoryId,
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
              `${process.env.SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}/data`,
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
                      manualCategoryId: manualCategoryId,
                    }),
                    encryptionKey
                  ).toString(),
                }),
              }
            );
          }
          const assetPriceUpdateId = createId();
          await fetch(
            `${process.env.SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}/assetPriceUpdates/${assetPriceUpdateId}`,
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
            `${process.env.SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}/data`,
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
          `${process.env.SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}/transactions/${transactionId}`,
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
      }
    }
    if (process.env.DATABASE_URL) {
      const existingAsset = user?.assets.find((asset) => {
        if (asset.symbol) {
          return asset.symbol === body.symbol;
        } else {
          return asset.name === body.name;
        }
      });
      if (!existingAsset) {
        let asset: Asset;
        if (body.isManualEntry) {
          const existingCategory = user.usersManualCategories.find(
            (manualCategory) => manualCategory.name === body.type
          );

          if (existingCategory) {
            asset = await prisma.asset.create({
              data: {
                ...body,
                userId: user.id,
                manualCategoryId: existingCategory.id,
              },
            });
          } else {
            const usersManualCategory = await prisma.usersManualCategory.create(
              {
                data: {
                  name: body.type,
                  userId: user.id,
                },
              }
            );
            asset = await prisma.asset.create({
              data: {
                ...body,
                userId: user.id,
                manualCategoryId: usersManualCategory.id,
              },
            });
          }

          const assetPriceUpdate = await prisma.assetPriceUpdate.create({
            data: {
              assetId: asset.id,
              price: body.currentPrice,
              date: body.buyDate,
            },
          });
        } else {
          asset = await prisma.asset.create({
            data: {
              ...body,
              userId: user.id,
            },
          });
        }
        await prisma.transaction.create({
          data: {
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

        if (!body.isManualEntry) {
          const asset = await prisma.asset.update({
            where: {
              id: existingAsset.id,
            },
            data: {
              quantity: updatedQuantity.toString(),
              buyPrice: avgBuyPrice.toString(),
            },
          });
        } else {
          const asset = await prisma.asset.update({
            where: {
              id: existingAsset.id,
            },
            data: {
              quantity: updatedQuantity.toString(),
              buyPrice: avgBuyPrice.toString(),
              currentPrice: body.currentPrice.toString(),
            },
          });
          const assetPriceUpdate = await prisma.assetPriceUpdate.create({
            data: {
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
