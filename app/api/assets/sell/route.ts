import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { canSellAssets } from "@/helper/canSellAssets";
// import { canSellAssets } from "@/helper/canSellAssets";

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
        },
      },
    },
  });

  if (user) {
    const ownedAsset = user.assets.filter(
      (asset) => asset.name === sellRequest.name
    );
    if (ownedAsset.length > 0) {
      // Get the required asset
      const assets = ownedAsset;

      if (canSellAssets(sellRequest, assets[0].transactions)) {
        let remainingQuantity: string = sellRequest.quantity;

        for (const asset of assets) {
          // Remove asset if sell quantiy is same as asset quantity
          if (+asset.quantity - +remainingQuantity == 0) {
            // make transaction
            await prisma.transaction.create({
              data: {
                date: sellRequest.date,
                quantity: remainingQuantity,
                price: sellRequest.price,
                type: "sell",
                assetId: asset.id,
              },
            });

            // update asset
            await prisma.asset.update({
              where: {
                id: asset.id,
              },
              data: {
                quantity: "0",
              },
            });
          }
          // Update asset quantity if asset quantity is greater than sell quantity
          else if (+asset.quantity - +remainingQuantity > 0) {
            // Add transaction
            await prisma.transaction.create({
              data: {
                date: sellRequest.date,
                quantity: (+remainingQuantity).toString(),
                price: sellRequest.price,
                type: "sell",
                assetId: asset.id,
              },
            });

            // Remove assets
            await prisma.asset.update({
              where: {
                id: asset.id,
              },
              data: {
                quantity: (+asset.quantity - +remainingQuantity).toString(),
              },
            });

            return Response.json({ success: "Successfully sold asset" });
          }
          // Update sell quantity and remove current asset instance
          else {
            remainingQuantity = (
              +remainingQuantity - +asset.quantity
            ).toString();
            await prisma.asset.update({
              where: {
                id: asset.id,
              },
              data: {
                quantity: "0",
              },
            });

            // Add transaction
            await prisma.transaction.create({
              data: {
                date: sellRequest.date,
                quantity: asset.quantity,
                price: sellRequest.price,
                type: "sell",
                assetId: asset.id,
              },
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
