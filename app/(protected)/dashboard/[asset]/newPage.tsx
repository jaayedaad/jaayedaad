"use client";
import { TAsset, TConversionRates, TInterval, TPreference } from "@/lib/types";
import AssetPieChart from "@/components/assetPieChart";
import AssetTable from "@/components/assetTable";
import ChangeInterval from "@/components/changeInterval";
import ManualTransactionChart from "@/components/manualTransactionChart";
import PortfolioLineChart from "@/components/portfolioLineChart";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { defaultCategories } from "@/constants/category";
import { getUnrealisedProfitLossArray } from "@/helper/unrealisedValueCalculator";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import jaayedaad_logo from "@/public/jaayedaad_logo.svg";
import Image from "next/image";
import AssetMarqueeBar from "@/components/assetMarqueeBar";

function Page({
  username,
  assetCategory,
  reverseMappedName,
  filteredAssets,
  historicalData,
  conversionRates,
  preferences,
}: {
  username: string;
  assetCategory: string;
  reverseMappedName: string;
  filteredAssets?: TAsset[];
  historicalData: any;
  conversionRates: TConversionRates;
  preferences: TPreference;
}) {
  const [assetsToView, setAssetsToView] = useState<TAsset[] | undefined>(
    filteredAssets
  );

  const categoryExist = filteredAssets?.some(
    (asset) => asset.type.toLowerCase() === reverseMappedName
  );

  let manualCategoryAsset: TAsset[] | undefined;
  if (categoryExist) {
    manualCategoryAsset = filteredAssets?.filter(
      (asset) => asset.type.toLowerCase() === reverseMappedName
    );
  }

  const [manualCategoryAssets, setManualCategoryAssets] = useState<
    TAsset[] | undefined
  >(manualCategoryAsset);
  const [timeInterval, setTimeInterval] = useState<TInterval>("1d");
  const [unrealisedProfitLossArray, setUnrealisedProfitLossArray] = useState<
    {
      type: string;
      symbol: string;
      compareValue: string;
      currentValue: string;
      prevClose: string;
      interval: string;
      unrealisedProfitLoss: string;
    }[]
  >();
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
    async function getPageData() {
      if (filteredAssets && filteredAssets.length) {
        if (!defaultCategories.includes(reverseMappedName)) {
          if (!categoryExist) {
            redirect("/dashboard");
          }
        } else {
          if (
            !filteredAssets.filter(
              (asset) => asset.type.toLowerCase() === reverseMappedName
            ).length
          ) {
            redirect("/dashboard");
          } else {
            if (historicalData) {
              const unrealisedResults = getUnrealisedProfitLossArray(
                historicalData,
                filteredAssets,
                conversionRates
              );
              setUnrealisedProfitLossArray(unrealisedResults);
            }
          }
        }
      }
    }

    getPageData();
  }, [filteredAssets, reverseMappedName]);

  // Get today's date
  const today = new Date();

  // Subtract one day
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const onChange = (value: TInterval) => {
    setTimeInterval(value);
    if (value !== "All" && filteredAssets) {
      const updatedAssetsToView = filteredAssets.map((asset) => {
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
      setAssetsToView(updatedAssetsToView);
    } else {
      setAssetsToView(filteredAssets);
    }
  };

  return filteredAssets ? (
    filteredAssets.length ? (
      <div className="px-6 sm:px-8 pt-6 pb-24 md:pb-32 lg:py-6 w-full lg:h-screen xl:h-screen flex flex-col">
        <div className="inline-flex lg:grid lg:grid-cols-3 justify-between items-center lg:gap-6">
          <div className="col-span-1">
            <h3 className="text-lg">
              Good {timeOfDay}, {username}
            </h3>
            <p>Your {assetCategory}</p>
          </div>
          <div className="flex items-center col-span-2">
            <div className="w-full">
              {assetsToView && (
                <AssetMarqueeBar
                  data={assetsToView}
                  timeInterval={timeInterval}
                  performanceBarOrder={preferences.performanceBarOrder}
                />
              )}
            </div>
            <Image
              src={jaayedaad_logo}
              alt="Jaayedaad logo"
              className="h-10 lg:hidden"
            />
            <div className="w-fit">
              <ChangeInterval onChange={onChange} />
            </div>
          </div>
        </div>
        <div className="min-h-[85vh] h-full mt-4">
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-6 lg:gap-4 lg:grid lg:grid-rows-7 lg:grid-cols-3 lg:h-full text-foreground">
            <div className="row-span-3 col-span-1 border rounded-xl p-4">
              <AssetPieChart
                view={reverseMappedName}
                assets={filteredAssets}
                dashboardAmountVisibility={
                  preferences.dashboardAmountVisibility
                }
                numberSystem={preferences.numberSystem}
                defaultCurrency={preferences.defaultCurrency}
                conversionRates={conversionRates}
              />
            </div>
            <div className="row-span-3 col-span-2 border rounded-xl p-4">
              {historicalData ? (
                defaultCategories.includes(reverseMappedName) ? (
                  <PortfolioLineChart
                    data={historicalData}
                    view={reverseMappedName}
                    timeInterval={timeInterval}
                    dashboardAmountVisibility={
                      preferences.dashboardAmountVisibility
                    }
                    numberSystem={preferences.numberSystem}
                    defaultCurrency={preferences.defaultCurrency}
                  />
                ) : (
                  manualCategoryAssets && (
                    <ManualTransactionChart
                      manualCategoryAssets={manualCategoryAssets}
                      timeInterval={timeInterval}
                      dashboardAmountVisibility={
                        preferences.dashboardAmountVisibility
                      }
                      numberSystem={preferences.numberSystem}
                      defaultCurrency={preferences.defaultCurrency}
                    />
                  )
                )
              ) : (
                <div>
                  <h3 className="font-semibold">Portfolio Performance</h3>
                  <p className="text-muted-foreground text-sm">
                    Insight into your portfolio&apos;s value dynamics
                  </p>
                  <div className="h-40 flex items-center">
                    <LoadingSpinner />
                  </div>
                </div>
              )}
            </div>
            <div className="row-span-4 flex flex-col col-span-3 border rounded-xl p-4">
              <div className="flex justify-between">
                <div className="xl:flex xl:items-center xl:gap-1">
                  <h3 className="font-semibold">Asset Overview</h3>
                  <p className="text-muted-foreground text-xs xl:text-sm">
                    Collection of your {reverseMappedName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-right text-xs xl:text-sm">
                    Last update on ({yesterday.toLocaleDateString("en-GB")})
                  </p>
                </div>
              </div>
              <div className="mt-6">
                {assetsToView ? (
                  <AssetTable
                    data={assetsToView}
                    historicalData={historicalData}
                    view={reverseMappedName}
                    timelineInterval={timeInterval}
                    conversionRates={conversionRates}
                    preferences={preferences}
                  />
                ) : (
                  <div className="h-56 flex items-center">
                    <LoadingSpinner />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="px-6 sm:px-8 pt-6 pb-24 lg:py-6 w-full h-screen flex flex-col items-center justify-center">
        <div className="text-lg">You don&apos;t own any {assetCategory}</div>
      </div>
    )
  ) : (
    <div className="px-6 sm:px-8 pt-6 pb-24 lg:py-6 w-full h-screen flex flex-col items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

export default Page;