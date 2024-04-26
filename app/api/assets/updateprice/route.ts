import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { createId } from "@paralleldrive/cuid2";
import CryptoJS from "crypto-js";
import { encryptObjectValues } from "@/lib/dataSecurity";
import { DATABASE_URL, ENCRYPTION_KEY, USE_SIA } from "@/constants/env";
import { uploadToSia } from "@/services/thirdParty/sia";

export async function POST(req: Request) {
  const body: {
    price: string;
    date: string;
    assetId: string;
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
      usersManualCategories: true,
    },
  });

  if (user) {
    const encryptionKey =
      user.id.slice(0, 4) + ENCRYPTION_KEY + user.id.slice(-4);

    const assetPriceUpdateId = createId();
    if (USE_SIA) {
      const priceUpdate = JSON.stringify({
        data: CryptoJS.AES.encrypt(
          JSON.stringify({
            id: assetPriceUpdateId,
            price: body.price,
            date: body.date,
            assetId: body.assetId,
          }),
          encryptionKey
        ).toString(),
      });

      await uploadToSia({
        data: priceUpdate,
        path: `${user.id}/assets/${body.assetId}/assetPriceUpdates/${assetPriceUpdateId}`,
      });
    }
    if (DATABASE_URL) {
      // encrypt data
      const encryptedData: {
        id: string;
        price: string;
        date: string;
        assetId: string;
      } = encryptObjectValues(
        {
          id: assetPriceUpdateId,
          price: body.price,
          date: body.date,
          assetId: body.assetId,
        },
        encryptionKey
      );
      const priceUpdate = await prisma.assetPriceUpdate.create({
        data: encryptedData,
      });
    }
    return Response.json({ success: "Price update successful!" });
  } else {
    return Response.json({ error: "Price update unsuccessful!" });
  }
}
