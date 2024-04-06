import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  DATABASE_URL,
  SIA_ADMIN_PASSWORD,
  SIA_ADMIN_USERNAME,
  SIA_API_URL,
} from "@/constants/env";

export async function POST(req: Request) {
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

    try {
      const body = await req.json();
      if (body.assetId) {
        if (SIA_API_URL) {
          await fetch(
            `${SIA_API_URL}/worker/objects/${user.id}/assets/${body.assetId}?batch=true`,
            {
              method: "DELETE",
              headers: {
                Authorization: basicAuth,
              },
            }
          );
        }
        if (DATABASE_URL) {
          await prisma.asset.delete({
            where: { id: body.assetId },
          });
        }
        return Response.json({ success: "Asset removed successfully!" });
      }
    } catch {
      return Response.json({ error: "Error Removing asset!" });
    }
  }
}
