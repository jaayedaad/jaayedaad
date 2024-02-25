import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function POST(req: Request) {
  const body: {
    price: string;
    date: string;
    assetId: string;
  } = await req.json();

  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: {
      assets: {
        include: {
          transactions: true,
        },
      },
      usersManualCategories: true,
    },
  });

  if (user) {
    const priceUpdate = await prisma.assetPriceUpdate.create({
      data: {
        price: body.price,
        date: body.date,
        assetId: body.assetId,
      },
    });

    if (priceUpdate) {
      return Response.json({ success: "Price update successful!" });
    } else {
      return Response.json({ error: "Price update unsuccessful!" });
    }
  }
}
