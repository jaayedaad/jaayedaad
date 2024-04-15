import {
  getDeccryptedAssetsByUserId,
  getAssetsQuoteFromApi,
} from "@/services/asset";
import Page from "./newPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getHistoricalData } from "@/services/thirdParty/twelveData";
import { getConversionRate } from "@/services/thirdParty/currency";
import { getPreferenceFromUserId } from "@/services/preference";
import { getUnrealisedProfitLossArray } from "@/helper/unrealisedValueCalculator";
import { TUnrealisedProfitLoss } from "@/lib/types";

const reverseAssetTypeMappings: Record<string, string> = {
  stocks: "common stock",
  crypto: "digital currency",
  "mutual funds": "mutual fund",
};

export default async function AssetPage({
  params,
}: {
  params: { asset: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    redirect("/");
  }

  const pageParams = decodeURIComponent(params.asset);
  const reverseMappedName = reverseAssetTypeMappings[pageParams] || pageParams;

  const assets = await getAssetsQuoteFromApi(
    await getDeccryptedAssetsByUserId(session.user.id)
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

  let unrealisedResults: TUnrealisedProfitLoss[] = [];

  if (historicalData.length) {
    unrealisedResults = getUnrealisedProfitLossArray(
      historicalData,
      filteredAssets,
      currencyConversionRates
    );
  }

  return (
    <Page
      username={session.user.username}
      user={session.user}
      assetCategory={pageParams.toLowerCase()}
      reverseMappedName={reverseMappedName}
      filteredAssets={filteredAssets}
      historicalData={historicalData}
      conversionRates={currencyConversionRates}
      preferences={preferences}
      unrealisedResults={unrealisedResults}
    />
  );
}
