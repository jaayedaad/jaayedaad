"use client";
import {
  TAsset,
  TConversionRates,
  TInterval,
  TPreference,
  TUser,
} from "@/lib/types";
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
import Image from "next/image";
import AssetMarqueeBar from "@/components/assetMarqueeBar";
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import JaayedaadLogo from "@/public/branding/jaayedaadLogo";
import { capitalize } from "@/lib/helper";

function Page({
  user,
  username,
  assetCategory,
  reverseMappedName,
  filteredAssets,
  historicalData,
  conversionRates,
  preferences,
}: {
  user: TUser;
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
    (asset) => asset.category.toLowerCase() === reverseMappedName
  );

  let manualCategoryAsset: TAsset[] | undefined;
  if (categoryExist) {
    manualCategoryAsset = filteredAssets?.filter(
      (asset) => asset.category.toLowerCase() === reverseMappedName
    );
  }

  const [manualCategoryAssets, setManualCategoryAssets] = useState<
    TAsset[] | undefined
  >(manualCategoryAsset);
  const [timeInterval, setTimeInterval] = useState<TInterval>("1d");
  const [unrealisedProfitLossArray, setUnrealisedProfitLossArray] = useState<
    {
      category: string;
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
              (asset) => asset.category.toLowerCase() === reverseMappedName
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
  }, [
    categoryExist,
    conversionRates,
    filteredAssets,
    historicalData,
    reverseMappedName,
  ]);

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
      <div className="px-6 sm:px-8 pt-6 pb-24 md:pb-32 lg:py-4 w-full lg:h-screen xl:h-screen flex flex-col">
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
            <div className="row-span-3 col-span-1 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-4">
              <AssetPieChart
                assetCategoryName={assetCategory}
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
            <div className="row-span-3 col-span-2 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-4">
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
                      conversionRates={conversionRates}
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
            <div className="row-span-4 flex flex-col col-span-3 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-4">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h3 className="font-semibold">
                    {capitalize(assetCategory)} Overview
                  </h3>
                  <p className="text-muted-foreground text-xs xl:text-sm">
                    Collection of your {assetCategory}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-right text-xs xl:text-sm">
                    As on ({yesterday.toLocaleDateString("en-GB")})
                  </p>
                </div>
              </div>
              <div className="mt-6 overflow-auto">
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
        <div className="hidden px-1 pt-2 lg:block">
          {assetsToView && (
            <AssetMarqueeBar
              assets={assetsToView}
              timeInterval={timeInterval}
              preferences={preferences}
            />
          )}
        </div>
      </div>
    ) : (
      <div className="px-6 sm:px-8 pt-6 pb-24 lg:py-6 w-full h-screen flex flex-col items-center justify-center">
        <TextRevealCard
          className="h-full w-full bg-background"
          text="Hover over me"
          revealText={`↙︎ You haven't added any ${assetCategory} yet.`}
        />
      </div>
    )
  ) : (
    <div className="px-6 sm:px-8 pt-6 pb-24 lg:py-6 w-full h-screen flex flex-col items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

export default Page;
