import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { createId } from "@paralleldrive/cuid2";
import CryptoJS from "crypto-js";
import { encryptObjectValues } from "@/lib/dataSecurity";
import {
  DATABASE_URL,
  ENCRYPTION_KEY,
  SIA_ADMIN_PASSWORD,
  SIA_ADMIN_USERNAME,
  SIA_API_URL,
} from "@/constants/env";

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
    const username = SIA_ADMIN_USERNAME;
    const password = SIA_ADMIN_PASSWORD;
    const basicAuth =
      "Basic " + Buffer.from(username + ":" + password).toString("base64");

    const encryptionKey =
      user.id.slice(0, 4) + ENCRYPTION_KEY + user.id.slice(-4);

    const assetPriceUpdateId = createId();
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
    if (SIA_API_URL) {
      await fetch(
        `${SIA_API_URL}/worker/objects/${user.id}/assets/${body.assetId}/assetPriceUpdates/${assetPriceUpdateId}`,
        {
          method: "PUT",
          headers: {
            Authorization: basicAuth,
          },
          body: JSON.stringify({
            data: CryptoJS.AES.encrypt(
              JSON.stringify({
                id: assetPriceUpdateId,
                price: body.price,
                date: body.date,
                assetId: body.assetId,
              }),
              encryptionKey
            ).toString(),
          }),
        }
      );
    }
    return Response.json({ success: "Price update successful!" });
  } else {
    return Response.json({ error: "Price update unsuccessful!" });
  }
}
