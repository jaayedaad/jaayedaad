import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { decryptObjectValues } from "@/lib/dataSecurity";
import { Asset } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ENCRYPTION_KEY } from "@/constants/env";

// Function to calculate similarity between two strings
function similarityScore(str1: string, str2: string) {
  const cleanStr1 = str1.toLowerCase().trim();
  const cleanStr2 = str2.toLowerCase().trim();
  const maxLength = Math.max(cleanStr1.length, cleanStr2.length);
  let matchingChars = 0;

  for (let i = 0; i < maxLength; i++) {
    if (cleanStr1[i] && cleanStr2[i] && cleanStr1[i] === cleanStr2[i]) {
      matchingChars++;
    }
  }

  // Calculate similarity as percentage
  return (matchingChars / maxLength) * 100;
}

function findTopMatchingAssets(assets: Asset[], searchString: string) {
  // Calculate similarity between searchString and asset names
  const matchingAssets = assets.map((asset) => {
    const similarity = similarityScore(asset.name, searchString);
    return { ...asset, similarity };
  });

  // Sort assets based on similarity score
  matchingAssets.sort((a, b) => b.similarity - a.similarity);

  // Return top 3 matching assets
  return matchingAssets.slice(0, 1);
}

function transformToResultFormat(
  topMatchingAssets: (Asset & { similarity: number })[]
) {
  return topMatchingAssets.map((asset) => ({
    instrument_name: asset.name,
    symbol: asset.symbol || "", // If symbol is null, set it to an empty string
    instrument_type: asset.category,
    exchange: asset.exchange || "", // If exchange is null, set it to an empty string
  }));
}

export async function POST(req: Request) {
  const body: { searchQuery: string } = await req.json();
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: {
      assets: true,
    },
  });

  if (user) {
    const encryptionKey =
      user.id.slice(0, 4) + ENCRYPTION_KEY + user.id.slice(-4);
    const assets = decryptObjectValues(
      user.assets,
      encryptionKey
    ) as typeof user.assets;
    const topMatchingAssets = findTopMatchingAssets(assets, body.searchQuery);
    const results = transformToResultFormat(topMatchingAssets);

    return Response.json(results);
  }
}
