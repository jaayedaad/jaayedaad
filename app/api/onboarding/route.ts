import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { type NextRequest } from "next/server";

export async function POST(req: Request) {
  const { username }: { username: string } = await req.json();
  const user = await prisma.user.findMany({
    where: {
      username: username,
    },
  });

  return new Response(JSON.stringify(user));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  const session = await getServerSession(authOptions);
  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email! },
    });

    if (user) {
      await prisma.user.update({
        where: {
          email: user?.email,
        },
        data: {
          username: username,
          emailVerified: new Date().toISOString(),
        },
      });
    }
    return new Response("OK");
  }
}
