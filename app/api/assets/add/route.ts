import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { calculateAvgBuyPrice } from "@/helper/transactionValueCalculator";

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
      const asset = await prisma.asset.create({
        data: {
          ...body,
          userId: user.id,
        },
      });
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

      await prisma.asset.update({
        where: {
          id: existingAsset.id,
        },
        data: {
          quantity: updatedQuantity.toString(),
          buyPrice: avgBuyPrice.toString(),
        },
      });
    }

    return new Response("OK");
  }
}
