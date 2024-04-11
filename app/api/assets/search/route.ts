import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { decryptObjectValues } from "@/lib/dataSecurity";
import { Asset } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ENCRYPTION_KEY } from "@/constants/env";

// Function to calculate similarity between search query and asset name
function similarityScore(assetName: string, searchString: string) {
  const cleanAssetName = assetName.toLowerCase().trim();
  const cleanSearchString = searchString.toLowerCase().trim();

  // Check if the asset name includes the search query
  return cleanAssetName.includes(cleanSearchString) ? 100 : 0;
}

function findTopMatchingAssets(assets: Asset[], searchString: string) {
  // Calculate similarity between searchString and asset names
  const matchingAssets = assets.map((asset) => {
    const similarity = similarityScore(asset.name, searchString);
    return { ...asset, similarity };
  });

  // Filter out assets with 0 similarity
  const filteredAssets = matchingAssets.filter((asset) => asset.similarity > 0);

  // Sort assets based on similarity score
  filteredAssets.sort((a, b) => b.similarity - a.similarity);

  // Return top matching asset if any
  return filteredAssets.slice(0, 1);
}

function transformToResultFormat(
  topMatchingAssets: (Asset & { similarity: number })[]
) {
  return topMatchingAssets.map((asset) => ({
    instrument_name: asset.name,
    symbol: asset.symbol || "", // If symbol is null, set it to an empty string
    instrument_type: asset.category,
    exchange: asset.exchange || "", // If exchange is null, set it to an empty string
    mic_code: "", // Not available in the database
    currency: asset.buyCurrency,
    country: "", // Not available in the database
    exchange_timezone: "", // Not available in the database
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

    // If there are no matching assets, return an empty array
    if (topMatchingAssets.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = transformToResultFormat(topMatchingAssets);

    return Response.json(results);
  }
}
