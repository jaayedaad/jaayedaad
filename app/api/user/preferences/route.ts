import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { Preference } from "@prisma/client";

export async function POST(req: Request) {
  const preferences: Preference = await req.json();

  const session = await getServerSession(authOptions);

  if (session) {
    // Get the current user with preferences
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email! },
      include: {
        preferences: true,
      },
    });

    await prisma.preference.update({
      where: {
        userId: user?.id,
      },
      data: preferences,
    });

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
    if (user && user.preferences === null) {
      const preferences = await prisma.preference.create({
        data: {
          userId: user.id,
        },
      });
      return new Response(JSON.stringify(preferences));
    } else {
      return new Response(JSON.stringify(user?.preferences));
    }
  }
}
