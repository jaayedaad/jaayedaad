import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { decryptObjectValues } from "@/utils/dataSecurity";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session) {
    const foundUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email!,
      },
      include: {
        usersManualCategories: {
          include: {
            assets: true,
          },
        },
      },
    });
    if (foundUser) {
      const encryptionKey =
        foundUser.id.slice(0, 4) +
        process.env.SIA_ENCRYPTION_KEY +
        foundUser.id.slice(-4);

      const response = {
        usersManualCategories: decryptObjectValues(
          foundUser.usersManualCategories,
          encryptionKey
        ) as typeof foundUser.usersManualCategories,
        userData: {
          id: foundUser?.id,
          name: foundUser?.name,
          username: foundUser?.username,
          email: foundUser?.email,
          emailVerified: foundUser?.emailVerified,
          image: foundUser?.image,
        },
      };

      return new Response(JSON.stringify(response));
    }
  }
}
