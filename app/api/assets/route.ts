import { prisma } from "@/lib/prisma";
import getAllAssets from "@/sia/getAllAssets";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user.email!,
      },
    });
    if (process.env.SIA_API_URL) {
      const assets = await getAllAssets();
      return Response.json(assets);
    } else if (process.env.DATABASE_URL) {
      const assets = await prisma.asset.findMany({
        where: {
          userId: user?.id,
        },
        include: {
          transactions: true,
          assetPriceUpdates: true,
        },
      });
      return Response.json(assets);
    }
  }
}
