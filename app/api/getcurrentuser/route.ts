import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

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
      const response = {
        usersManualCategories: foundUser.usersManualCategories,
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
