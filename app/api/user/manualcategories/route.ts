import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/lib/prisma";
import CryptoJS from "crypto-js";
import { createId } from "@paralleldrive/cuid2";
import dynamicIconImports from "lucide-react/dynamicIconImports";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body: {
    icon: keyof typeof dynamicIconImports;
    name: string;
  } = await req.json();

  // Check if the icon type is valid
  if (!dynamicIconImports.hasOwnProperty(body.icon)) {
    return new Response("Icon type not allowed", { status: 400 });
  }

  if (session) {
    // Get the current user with preferences
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email! },
      include: {
        preferences: true,
      },
    });

    if (user) {
      const username = "username";
      const password = "1234";
      const basicAuth =
        "Basic " + Buffer.from(username + ":" + password).toString("base64");

      const encryptionKey =
        user.id.slice(0, 4) +
        process.env.SIA_ENCRYPTION_KEY +
        user.id.slice(-4);

      // create a new category
      const manualCategoryId = createId();
      if (process.env.SIA_API_URL) {
        await fetch(
          `${process.env.SIA_API_URL}/worker/objects/${user.id}/usersManualCategories/${manualCategoryId}/data`,
          {
            method: "PUT",
            headers: {
              Authorization: basicAuth,
            },
            body: JSON.stringify({
              data: CryptoJS.AES.encrypt(
                JSON.stringify({
                  id: manualCategoryId,
                  icon: body.icon,
                  name: body.name,
                  userId: user.id,
                }),
                encryptionKey
              ).toString(),
            }),
          }
        );
      }
      if (process.env.DATABASE_URL) {
        const usersManualCategory = await prisma.usersManualCategory.create({
          data: {
            id: manualCategoryId,
            icon: body.icon,
            name: body.name,
            userId: user.id,
          },
        });

        return new Response("Category created successfully", { status: 200 });
      }
    }
  }
}
