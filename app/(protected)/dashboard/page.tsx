import {
  getDeccryptedAssetsByUserId,
  getAssetsQuoteFromApi,
} from "@/services/asset";
import Dashboard from "./newPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getConversionRate } from "@/services/thirdParty/currency";
import { getHistoricalData } from "@/services/thirdParty/twelveData";
import { getPreferenceFromUserId } from "@/services/preference";
import { getUnrealisedProfitLossArray } from "@/helper/unrealisedValueCalculator";
import { calculateRealisedProfitLoss } from "@/helper/realisedValueCalculator";
import { TGroupedAssets, TUnrealisedProfitLoss } from "@/types/types";
import { getDashboardTableData } from "@/services/dashboard/tableData";
import { getLineChartData } from "@/helper/prepareLineChartData";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    redirect("/");
  }

  const usernameSet = !session.user.username;
  const assets = await getAssetsQuoteFromApi(
    await getDeccryptedAssetsByUserId(session.user.id)
  );

  const currencyConversionRates = await getConversionRate(session.user.id);
  if (!currencyConversionRates) {
    throw new Error("Currency conversion rates not found");
  }
  const historicalData = await getHistoricalData(session.user.id, assets);

  const preferences = await getPreferenceFromUserId(session.user.id);
  if (!preferences) {
    throw new Error("Preference not found");
  }

  let unrealisedResults: TUnrealisedProfitLoss[] = [];
  let lineChartData: {
    interval: string;
    data: {
      name: string;
      amt: number;
    }[];
  }[] = [];
  let dashboardTableData: {
    interval: string;
    data: TGroupedAssets;
  }[] = [];

  if (historicalData.length) {
    unrealisedResults = getUnrealisedProfitLossArray(
      historicalData,
      assets,
      currencyConversionRates
    );

    lineChartData = await getLineChartData(historicalData);

    dashboardTableData = await getDashboardTableData(
      assets,
      unrealisedResults,
      currencyConversionRates
    );
  }

  const realisedResults = calculateRealisedProfitLoss(
    assets,
    currencyConversionRates
  );

  return (
    <Dashboard
      usernameSet={usernameSet}
      user={session.user}
      username={session.user.username}
      whitelisted={session.user.whitelisted}
      assets={assets}
      unrealisedResults={unrealisedResults}
      realisedResults={realisedResults}
      conversionRates={currencyConversionRates}
      dashboardTableData={dashboardTableData}
      lineChartData={lineChartData}
      historicalData={historicalData}
      preferences={preferences}
    />
  );
};

export default DashboardPage;
