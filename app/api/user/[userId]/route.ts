import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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
      const username = "username";
      const password = "1234";
      const basicAuth =
        "Basic " + Buffer.from(username + ":" + password).toString("base64");

      try {
        if (process.env.SIA_API_URL) {
          await fetch(
            `${process.env.SIA_API_URL}/worker/objects/${user.id}?batch=true`,
            {
              method: "DELETE",
              headers: {
                Authorization: basicAuth,
              },
            }
          );
        }
        if (process.env.DATABASE_URL) {
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
