import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const preferences = await req.json();
  const session = await getServerSession(authOptions);

  if (session) {
    // Get the current user with preferences
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email! },
      include: {
        preferences: true,
      },
    });

    if (user?.preferences.length === 0) {
      await prisma.preference.create({
        data: {
          publicProfile: preferences.publicProfile,
          userId: user.id,
        },
      });
    } else {
      await prisma.preference.update({
        where: {
          userId: user?.id,
        },
        data: {
          publicProfile: preferences.publicProfile,
        },
      });
    }
    return new Response("OK");
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Get the current user with preferences
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email! },
      include: {
        preferences: true,
      },
    });

    return new Response(JSON.stringify(user?.preferences[0]));
  }
}
