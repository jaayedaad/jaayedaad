import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  try {
    const assetId = await req.json();
    if (assetId) {
      await prisma.asset.delete({
        where: { id: assetId },
      });
      return Response.json({ success: "Asset removed successfully!" });
    }
  } catch {
    return Response.json({ error: "Error Removing asset!" });
  }
}
