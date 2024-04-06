import { prisma } from "@/lib/prisma";
import { decryptObjectValues } from "@/lib/dataSecurity";
import { ENCRYPTION_KEY } from "@/constants/env";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      preferences: true,
    },
  });

  if (user) {
    if (!user.preferences?.publicVisibility) {
      return new Response("User has a private profile", { status: 403 });
    } else {
      const encryptionKey =
        userId.slice(0, 4) + ENCRYPTION_KEY + userId.slice(-4);

      let assets = await prisma.asset.findMany({
        where: {
          userId: userId,
        },
        include: {
          transactions: true,
          assetPriceUpdates: true,
        },
      });

      assets = decryptObjectValues(assets, encryptionKey);
      return Response.json(assets);
    }
  } else {
    return new Response("User not found", { status: 404 });
  }
}
