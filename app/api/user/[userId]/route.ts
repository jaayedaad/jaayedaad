import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  DATABASE_URL,
  SIA_ADMIN_PASSWORD,
  SIA_ADMIN_USERNAME,
  SIA_API_URL,
} from "@/constants/env";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const session = await getServerSession(authOptions);
  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        preferences: true,
      },
    });

    if (user) {
      const username = SIA_ADMIN_USERNAME;
      const password = SIA_ADMIN_PASSWORD;
      const basicAuth =
        "Basic " + Buffer.from(username + ":" + password).toString("base64");

      try {
        if (SIA_API_URL) {
          await fetch(`${SIA_API_URL}/worker/objects/${user.id}?batch=true`, {
            method: "DELETE",
            headers: {
              Authorization: basicAuth,
            },
          });
        }
        if (DATABASE_URL) {
          await prisma.user.delete({
            where: { id: userId },
          });
        }
        return Response.json({ success: "Account deleted successfully!" });
      } catch {
        return Response.json({ error: "Error deleting asset!" });
      }
    }
  }
}
