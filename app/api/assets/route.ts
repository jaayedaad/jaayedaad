import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { decryptObjectValues } from "@/lib/dataSecurity";
import { getServerSession } from "next-auth";
import { getDecryptedAssetsFromSia } from "@/services/thirdParty/sia";
import { DATABASE_URL, ENCRYPTION_KEY, USE_SIA } from "@/constants/env";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user.email!,
      },
    });

    const encryptionKey =
      user?.id.slice(0, 4) + ENCRYPTION_KEY + user?.id.slice(-4);

    if (DATABASE_URL) {
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
    } else if (USE_SIA) {
      const assets = await getDecryptedAssetsFromSia();
      return Response.json(assets);
    } else {
      throw new Error("Neither DATABASE_URL nor USE_SIA is configured.");
    }
  }
}
