import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { calculateAvgBuyPrice } from "@/helper/transactionValueCalculator";
import { Asset } from "@prisma/client";

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
          const usersManualCategory = await prisma.usersManualCategory.create({
            data: {
              name: body.type,
              userId: user.id,
            },
          });
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

    return new Response("OK");
  }
}
