import { getConversionRate } from "@/services/thirdParty/currency";
import { getPreferenceFromUserId } from "@/services/preference";
import { Separator } from "@/components/ui/separator";
import { getUserByUsername } from "@/services/user";
import {
  getDeccryptedAssetsByUserId,
  getAssetsQuoteFromApi,
} from "@/services/asset";
import { getHistoricalData } from "@/services/thirdParty/twelveData";
import { getUnrealisedProfitLossArray } from "@/helper/unrealisedValueCalculator";
import { calculateRealisedProfitLoss } from "@/helper/realisedValueCalculator";
import React from "react";
import AssetPieChart from "@/components/assetPieChart";
import AssetTable from "@/components/assetTable";
import LoadingSpinner from "@/components/ui/loading-spinner";
import PortfolioLineChart from "@/components/portfolioLineChart";
import PerformanceMetrics from "@/components/performanceMetrics";
import { getLineChartData } from "@/helper/prepareLineChartData";

export default async function PublicProfile({
  params,
}: {
  params: { username: string };
}) {
  const user = await getUserByUsername(params.username);
  if (!user) {
    throw new Error("User not found");
  }

  const preferences = await getPreferenceFromUserId(user.id);
  if (!preferences) {
    throw new Error("Preference not found");
  }
  const conversionRates = await getConversionRate(user.id);
  if (!conversionRates) {
    throw new Error("Conversion rates not found");
  }

  const assets = await getAssetsQuoteFromApi(
    await getDeccryptedAssetsByUserId(user.id)
  );
  const historicalData = await getHistoricalData(user.id, assets);

  let lineChartData: {
    interval: string;
    data: {
      name: string;
      amt: number;
    }[];
  }[] = [];
  if (historicalData.length) {
    lineChartData = await getLineChartData(historicalData);
  }

  const unrealisedResults = getUnrealisedProfitLossArray(
    historicalData,
    assets,
    conversionRates
  );

  const realisedResults = calculateRealisedProfitLoss(assets, conversionRates);

  const today = new Date();

  // Subtract one day
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return (
    <div className="lg:h-screen">
      {preferences.publicVisibility ? (
        <div className="h-full">
          {preferences && (
            <div className="grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-7 h-full gap-6 p-6">
              {preferences.showHoldingsInPublic && (
                <div className="lg:col-span-2 lg:row-span-3 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-6">
                  <AssetPieChart
                    view="dashboard"
                    assets={assets}
                    dashboardAmountVisibility={
                      preferences.dashboardAmountVisibility
                    }
                    numberSystem={preferences.numberSystem}
                    defaultCurrency={preferences.defaultCurrency}
                    conversionRates={conversionRates}
                  />
                </div>
              )}
              {/* Portfolio Performance */}
              {preferences.showMetricsInPublic && (
                <div className="lg:col-span-4 lg:row-span-3 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-6">
                  {historicalData ? (
                    historicalData.length ? (
                      <PortfolioLineChart
                        chartData={lineChartData}
                        timeInterval="All"
                        dashboardAmountVisibility={
                          preferences.dashboardAmountVisibility
                        }
                        numberSystem={preferences.numberSystem}
                        defaultCurrency={preferences.defaultCurrency}
                      />
                    ) : (
                      <div>
                        <h3 className="font-semibold">Portfolio Performance</h3>
                        <p className="text-muted-foreground text-xs xl:text-sm">
                          Insight into your portfolio&apos;s value dynamics
                        </p>
                        <div className="h-40 flex items-center justify-center">
                          You don&apos;t own any assets yet
                        </div>
                      </div>
                    )
                  ) : (
                    <div>
                      <h3 className="font-semibold">Portfolio Performance</h3>
                      <p className="text-muted-foreground text-xs xl:text-sm">
                        Insight into your portfolio&apos;s value dynamics
                      </p>
                      <div className="h-40 flex items-center">
                        <LoadingSpinner />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Asset Table */}
              {preferences.showHoldingsInPublic && (
                <div className="flex flex-col lg:col-span-4 lg:row-span-4 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-6">
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <h3 className="font-semibold">Asset Overview</h3>
                      <p className="text-muted-foreground text-xs xl:text-sm">
                        Collection of your assets
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-end text-xs xl:text-sm">
                        As on ({yesterday.toLocaleDateString("en-GB")})
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 overflow-auto">
                    <AssetTable
                      isPublic
                      data={assets}
                      lineChartData={lineChartData}
                      unrealisedResults={unrealisedResults}
                      realisedResults={realisedResults}
                      conversionRates={conversionRates}
                      preferences={preferences}
                    />
                  </div>
                </div>
              )}
              {/* Metrics */}
              {preferences.showMetricsInPublic && (
                <div className="lg:col-span-2 lg:row-span-4 flex flex-col justify-between bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-6">
                  <div>
                    <h3 className="font-semibold">Performance Metrics</h3>
                    <p className="text-muted-foreground text-xs xl:text-sm">
                      Analyze investment performance
                    </p>
                  </div>

                  <PerformanceMetrics
                    assets={assets}
                    realisedProfitLossArray={realisedResults}
                    unrealisedProfitLossArray={unrealisedResults}
                    timeInterval="All"
                    dashboardAmountVisibility={
                      preferences.dashboardAmountVisibility
                    }
                    numberSystem={preferences.numberSystem}
                    defaultCurrency={preferences.defaultCurrency}
                    conversionRates={conversionRates}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="flex gap-6 h-20 items-center">
            <h1 className="text-4xl font-mona-sans">404</h1>
            <Separator orientation="vertical" className="bg-primary/50" />
            <h1 className="text-4xl font-mona-sans">No such user exist!</h1>
          </div>
        </div>
      )}
    </div>
  );
}
