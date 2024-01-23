import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  if (user) {
    const asset = await prisma.asset.create({
      data: {
        name: body.shortname,
        symbol: body.symbol,
        quantity: body.quantity,
        buyPrice: body.buyPrice,
        buyDate: body.buyDate,
        userId: user.id,
      },
    });
  }

  return new Response("OK");
}
