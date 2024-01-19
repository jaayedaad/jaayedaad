import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  const { assetId } = await req.json();
  if (assetId) {
    await prisma.asset.delete({
      where: { id: assetId },
    });
  }
  return new Response("OK");
}
