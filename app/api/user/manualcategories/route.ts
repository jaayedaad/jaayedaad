import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import CryptoJS from "crypto-js";
import { createId } from "@paralleldrive/cuid2";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { encryptObjectValues } from "@/lib/dataSecurity";
import {
  DATABASE_URL,
  ENCRYPTION_KEY,
  SIA_ADMIN_PASSWORD,
  SIA_ADMIN_USERNAME,
  SIA_API_URL,
  USE_SIA,
} from "@/constants/env";

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
      const username = SIA_ADMIN_USERNAME;
      const password = SIA_ADMIN_PASSWORD;
      const basicAuth =
        "Basic " + Buffer.from(username + ":" + password).toString("base64");

      const encryptionKey =
        user.id.slice(0, 4) + ENCRYPTION_KEY + user.id.slice(-4);

      // create a new category
      const manualCategoryId = createId();
      if (USE_SIA) {
        await fetch(
          `${SIA_API_URL}/worker/objects/${user.id}/usersManualCategories/${manualCategoryId}/data`,
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
      if (DATABASE_URL) {
        // encrypt data
        const encryptedData: {
          id: string;
          icon: keyof typeof dynamicIconImports;
          name: string;
          userId: string;
        } = encryptObjectValues(
          {
            id: manualCategoryId,
            icon: body.icon,
            name: body.name,
            userId: user.id,
          },
          encryptionKey
        );
        const usersManualCategory = await prisma.usersManualCategory.create({
          data: encryptedData,
        });

        return new Response("Category created successfully", {
          status: 200,
          statusText: "OK",
        });
      }
    }
  }
}
