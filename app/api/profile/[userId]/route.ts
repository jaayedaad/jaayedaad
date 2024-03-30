import { prisma } from "@/lib/prisma";
import { decryptObjectValues } from "@/utils/dataSecurity";

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
    if (!user.preferences[0].publicProfile) {
      return new Response("User has a private profile", { status: 403 });
    } else {
      const encryptionKey =
        userId.slice(0, 4) + process.env.SIA_ENCRYPTION_KEY + userId.slice(-4);

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
