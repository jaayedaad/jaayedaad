import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import { canSellAssets } from "@/helper/canSellAssets";

export async function PUT(req: Request) {
  const sellRequest = await req.json();
  const session = await getServerSession(authOptions);

  if (session) {
    // Get the required asset
    const assets = await prisma.asset.findMany({
      where: {
        name: sellRequest.shortname,
      },
    });

    if (canSellAssets(sellRequest.quantity, assets)) {
      let remainingQuantity: string = sellRequest.quantity;
      // Sort assets by date
      const sortedAssets = assets.sort(
        (a, b) => new Date(a.buyDate).getTime() - new Date(b.buyDate).getTime()
      );

      for (const asset of sortedAssets) {
        // Remove asset if sell quantiy is same as asset quantity
        if (+asset.quantity - +remainingQuantity == 0) {
          await prisma.asset.delete({
            where: {
              id: asset.id,
            },
          });
        }
        // Update asset quantity if asset quantity is greater than sell quantity
        else if (+asset.quantity - +remainingQuantity > 0) {
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
          remainingQuantity = (+remainingQuantity - +asset.quantity).toString();
          await prisma.asset.delete({
            where: {
              id: asset.id,
            },
          });
        }
      }

      return Response.json({ success: "Successfully sold asset" });
    } else {
      return Response.json({ error: "Not enough assets in account!" });
    }
  }

  return new Response("OK");
}
