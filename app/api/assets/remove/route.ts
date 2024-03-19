import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

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
    const username = "username";
    const password = "1234";
    const basicAuth =
      "Basic " + Buffer.from(username + ":" + password).toString("base64");

    try {
      const assetId = await req.json();
      if (assetId) {
        if (process.env.SIA_API_URL) {
          await fetch(
            `${process.env.SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}?batch=true`,
            {
              method: "DELETE",
              headers: {
                Authorization: basicAuth,
              },
            }
          );
        }
        if (process.env.DATABASE_URL) {
          await prisma.asset.delete({
            where: { id: assetId },
          });
        }
        return Response.json({ success: "Asset removed successfully!" });
      }
    } catch {
      return Response.json({ error: "Error Removing asset!" });
    }
  }
}
