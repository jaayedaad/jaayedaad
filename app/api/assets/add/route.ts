import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function POST(req: Request) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: {
      assets: true,
    },
  });

  if (user) {
    const existingAsset = user?.assets.find(
      (asset) => asset.symbol === body.symbol
    );
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
      const totalValue =
        +existingAsset.buyPrice * +existingAsset.quantity +
        +body.quantity * +body.buyPrice;
      const avgBuyPrice = totalValue / updatedQuantity;

      await prisma.asset.update({
        where: {
          id: existingAsset.id,
        },
        data: {
          quantity: updatedQuantity.toString(),
          buyPrice: avgBuyPrice.toString(),
        },
      });
      await prisma.transaction.create({
        data: {
          date: body.buyDate,
          quantity: body.quantity,
          price: body.buyPrice,
          type: "buy",
          assetId: existingAsset.id,
        },
      });
    }

    return new Response("OK");
  }
}
