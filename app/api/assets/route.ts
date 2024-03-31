import { prisma } from "@/lib/prisma";
import getAllAssets from "@/sia/getAllAssets";
import { authOptions } from "@/lib/authOptions";
import { decryptObjectValues } from "@/lib/dataSecurity";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user.email!,
      },
    });

    const encryptionKey =
      user?.id.slice(0, 4) +
      process.env.SIA_ENCRYPTION_KEY +
      user?.id.slice(-4);

    if (process.env.SIA_API_URL) {
      const assets = await getAllAssets();
      return Response.json(assets);
    } else if (process.env.DATABASE_URL) {
      let assets = await prisma.asset.findMany({
        where: {
          userId: user?.id,
        },
        include: {
          transactions: true,
          assetPriceUpdates: true,
        },
      });

      assets = decryptObjectValues(assets, encryptionKey);
      return Response.json(assets);
    }
  }
}
