import { prisma } from "@/lib/prisma";
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
