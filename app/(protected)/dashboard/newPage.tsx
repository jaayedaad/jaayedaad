"use client";
import AssetPieChart from "@/components/assetPieChart";
import AssetTable from "@/components/assetTable";
import ChangeInterval from "@/components/changeInterval";
import PerformanceMetrics from "@/components/performanceMetrics";
import PortfolioLineChart from "@/components/portfolioLineChart";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { calculateRealisedProfitLoss } from "@/helper/realisedValueCalculator";
import { getUnrealisedProfitLossArray } from "@/helper/unrealisedValueCalculator";
import { useEffect, useState } from "react";
import Image from "next/image";
import AssetMarqueeBar from "@/components/assetMarqueeBar";
import {
  TAsset,
  TInterval,
  TProfitLoss,
  TConversionRates,
  TPreference,
  TUser,
} from "@/lib/types";
import WhitelistingModal from "@/components/onboarding/whitelistingModal";
import MockLineChart from "@/components/mock/mockLineChart";
import MockAssetTable from "@/components/mock/mockAssetTable";
import OnboardingModal from "@/components/onboarding/onboardingModal";
import JaayedaadLogo from "@/public/branding/jaayedaadLogo";

export function Dashboard({
  user,
  usernameSet,
  username,
  whitelisted,
  assets,
  conversionRates,
  historicalData,
  preferences,
  unrealisedResults,
  realisedResults,
}: {
  user: TUser;
  usernameSet: boolean;
  username: string;
  whitelisted: boolean;
  assets: TAsset[];
  conversionRates: TConversionRates;
  historicalData: any; // TODO: define type in return of this method from ssr
  preferences: TPreference;
  unrealisedResults: {
    category: string;
    symbol: string;
    compareValue: string;
    valueAtInterval: number;
    currentValue: string;
    prevClose: string;
    interval: string;
    unrealisedProfitLoss: string;
  }[];
  realisedResults: TProfitLoss[];
}) {
  const [realisedProfitLoss, setRealisedProfitLoss] = useState<string>();
  const [timeInterval, setTimeInterval] = useState<TInterval>("All");
  const [unrealisedProfitLossArray, setUnrealisedProfitLossArray] = useState<
    {
      category: string;
      symbol: string;
      compareValue: string;
      currentValue: string;
      valueAtInterval: number;
      prevClose: string;
      interval: string;
      unrealisedProfitLoss: string;
    }[]
  >(unrealisedResults);
  const [realisedProfitLossArray, setRealisedProfitLossArray] =
    useState<TProfitLoss[]>(realisedResults);
  const [marqueeBarAssets, setMarqueeBarAssets] = useState<
    TAsset[] | undefined
  >(assets);
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    const currentTime = new Date().getHours();

    if (currentTime < 12) {
      setTimeOfDay("morning");
    } else if (currentTime >= 12 && currentTime < 18) {
      setTimeOfDay("afternoon");
    } else {
      setTimeOfDay("evening");
    }
  }, []);

  useEffect(() => {
    if (assets && conversionRates) {
      if (historicalData?.length) {
        const unrealisedResults = getUnrealisedProfitLossArray(
          historicalData,
          assets,
          conversionRates
        );
        setUnrealisedProfitLossArray(unrealisedResults);
      }
      const realisedProfitLossResults = calculateRealisedProfitLoss(
        assets,
        conversionRates
      );
      if (timeInterval === "All") {
        setRealisedProfitLoss(
          realisedProfitLossResults.filter(
            (profitLoss) => profitLoss.interval === "All"
          )[0].realisedProfitLoss
        );
      }
      setRealisedProfitLossArray(realisedProfitLossResults);
    }
  }, [historicalData, timeInterval, conversionRates, assets]);

  // Get today's date
  const today = new Date();

  // Subtract one day
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const onChange = (value: TInterval) => {
    setTimeInterval(value);
    const profitLoss = realisedProfitLossArray?.filter(
      (profitLoss) => profitLoss.interval === value
    )[0].realisedProfitLoss;
    setRealisedProfitLoss(profitLoss);

    if (value !== "All" && assets) {
      const updatedAssetsToView = assets.map((asset) => {
        const matchingIntervalData = unrealisedProfitLossArray?.find(
          (data) => data.symbol === asset.symbol && data.interval === value
        );
        if (matchingIntervalData) {
          return {
            ...asset,
            compareValue: +matchingIntervalData.compareValue,
            currentValue: +matchingIntervalData.currentValue,
            prevClose: matchingIntervalData.prevClose,
          };
        }
        return asset;
      });
      setMarqueeBarAssets(updatedAssetsToView);
    } else {
      setMarqueeBarAssets(assets);
    }
  };

  return assets ? (
    <>
      <div className="px-6 sm:px-8 pt-6 pb-20 md:pb-24 lg:py-4 w-full lg:h-screen xl:h-screen flex flex-col">
        <div className="inline-flex lg:grid lg:grid-cols-2 justify-between items-center lg:gap-6">
          <div className="col-span-1 hidden lg:block">
            <div className="flex gap-2">
              <Image
                className="rounded-full"
                width={52}
                height={52}
                src={user.image}
                alt="user avatar"
              />
              <div>
                <p className="text-sm text-muted-foreground">
                  Good {timeOfDay}
                </p>
                <h3 className="text-2xl font-samarkan">{username}</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-between lg:justify-end items-center w-full lg:w-auto">
            <JaayedaadLogo className="h-8 lg:hidden" />
            <div className="ml-2 w-fit">
              <ChangeInterval onChange={onChange} />
            </div>
          </div>
        </div>
        <div className="min-h-[85vh] h-full mt-4">
          <div className="gap-4 sm:gap-6 md:gap-6 lg:gap-4 grid grid-rows-4 grid-cols-1 lg:grid-rows-7 lg:grid-cols-3 lg:h-full text-foreground">
            {/* Asset distribution pie chart */}
            <div className="lg:col-span-1 lg:row-span-3 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-4">
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
            {/* Portfolio line chart */}
            <div className="lg:col-span-2 lg:row-span-3 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-4">
              {historicalData ? (
                historicalData.length ? (
                  <PortfolioLineChart
                    data={historicalData}
                    view="dashboard"
                    timeInterval={timeInterval}
                    dashboardAmountVisibility={
                      preferences.dashboardAmountVisibility
                    }
                    numberSystem={preferences.numberSystem}
                    defaultCurrency={preferences.defaultCurrency}
                  />
                ) : (
                  <div className="h-full">
                    <h3 className="font-semibold">Portfolio Performance</h3>
                    <p className="text-muted-foreground text-xs xl:text-sm">
                      Insight into your portfolio&apos;s value dynamics
                    </p>
                    <MockLineChart />
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
            {/* Asset Table */}
            <div className="flex flex-col lg:col-span-2 lg:row-span-4 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-4">
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
                {assets.length ? (
                  <AssetTable
                    data={assets}
                    historicalData={historicalData}
                    timelineInterval={timeInterval}
                    intervalChangeData={unrealisedProfitLossArray}
                    conversionRates={conversionRates}
                    preferences={preferences}
                  />
                ) : (
                  <MockAssetTable />
                )}
              </div>
            </div>
            {/* Performance metrics */}
            <div className="lg:col-span-1 lg:row-span-4 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-4 mb-4 md:mb-6 lg:mb-0">
              <h3 className="font-semibold">Performance Metrics</h3>
              <p className="text-muted-foreground text-xs xl:text-sm">
                Analyze investment performance
              </p>
              <PerformanceMetrics
                assets={assets}
                realisedProfitLoss={realisedProfitLoss}
                unrealisedProfitLossArray={unrealisedProfitLossArray}
                timeInterval={timeInterval}
                dashboardAmountVisibility={
                  preferences.dashboardAmountVisibility
                }
                numberSystem={preferences.numberSystem}
                defaultCurrency={preferences.defaultCurrency}
                conversionRates={conversionRates}
              />
            </div>
          </div>
        </div>
        <div className="hidden px-1 pt-2 lg:block">
          {marqueeBarAssets && (
            <AssetMarqueeBar
              assets={marqueeBarAssets}
              timeInterval={timeInterval}
              preferences={preferences}
            />
          )}
        </div>
      </div>
      <WhitelistingModal whitelisted={whitelisted} />
      <OnboardingModal usernameSet={usernameSet} />
    </>
  ) : (
    <div className="flex flex-col justify-center items-center gap-2 w-full h-auto">
      <LoadingSpinner />
      <div>Loading your dashboard...</div>
    </div>
  );
}

export default Dashboard;
