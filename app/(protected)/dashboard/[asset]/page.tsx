import { getAssetsByUser, getAssetsQuoteFromApi } from "@/services/asset";
import Page from "./newPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getHistoricalData } from "@/services/thirdParty/twelveData";
import { getConversionRate } from "@/services/thirdParty/currency";
import { getPreferenceFromUserId } from "@/services/preference";

const reverseAssetTypeMappings: Record<string, string> = {
  stocks: "common stock",
  crypto: "digital currency",
};

export default async function AssetPage({
  params,
}: {
  params: { asset: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    redirect("/auth/signin");
  }

  const pageParams = decodeURIComponent(params.asset);
  const reverseMappedName = reverseAssetTypeMappings[pageParams] || pageParams;

  const assets = await getAssetsQuoteFromApi(
    await getAssetsByUser(session.user.email)
  );

  const filteredAssets = assets?.filter(
    (asset) => asset.category.toLowerCase() === reverseMappedName
  );

  const currencyConversionRates = await getConversionRate(session.user.id);
  if (!currencyConversionRates) {
    throw new Error("Currency conversion rates not found");
  }
  const historicalData = await getHistoricalData(
    session.user.id,
    filteredAssets
  );

  const preferences = await getPreferenceFromUserId(session.user.id);
  if (!preferences) {
    throw new Error("Preference not found");
  }

  return (
    <Page
      username={session.user.username}
      assetCategory={pageParams.toLowerCase()}
      reverseMappedName={reverseMappedName}
      filteredAssets={filteredAssets}
      historicalData={historicalData}
      conversionRates={currencyConversionRates}
      preferences={preferences}
    />
  );
}
