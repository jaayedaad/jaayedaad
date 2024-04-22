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
import { TAsset, TLineChartData, TUnrealisedProfitLoss } from "@/types/types";
import { getAssetTableData } from "@/services/dashboard/assets/assetTableData";
import { calculateRealisedProfitLoss } from "@/helper/realisedValueCalculator";
import { getLineChartData } from "@/helper/prepareLineChartData";

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
  let assetsUnrealisedResults: {
    assetId: string;
    unrealisedResults: TUnrealisedProfitLoss[];
  }[] = [];
  let lineChartData: TLineChartData = [];
  let assetsChartData: {
    assetId: string;
    lineChartData: TLineChartData;
  }[] = [];
  let assetTableData: {
    interval: string;
    data: TAsset[];
  }[] = [];

  if (historicalData.length) {
    unrealisedResults = getUnrealisedProfitLossArray(
      historicalData,
      filteredAssets,
      currencyConversionRates
    );
    lineChartData = await getLineChartData(historicalData);

    historicalData.forEach(async (data) => {
      assetsChartData.push({
        assetId: data.assetId,
        lineChartData: await getLineChartData([data]),
      });
    });
    assetTableData = await getAssetTableData(filteredAssets, unrealisedResults);
  }

  const realisedResults = calculateRealisedProfitLoss(
    assets,
    currencyConversionRates
  );

  return (
    <Page
      username={session.user.username}
      user={session.user}
      assetCategory={pageParams.toLowerCase()}
      reverseMappedName={reverseMappedName}
      assetTableData={assetTableData}
      filteredAssets={filteredAssets}
      historicalData={historicalData}
      lineChartData={lineChartData}
      assetsChartData={assetsChartData}
      conversionRates={currencyConversionRates}
      preferences={preferences}
      unrealisedResults={unrealisedResults}
      realisedResults={realisedResults}
    />
  );
}
