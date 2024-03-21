"use client";
import { Asset } from "@/actions/getAssetsAction";
import { getConversionRate } from "@/actions/getConversionRateAction";
import AssetPieChart from "@/components/assetPieChart";
import AssetTable from "@/components/assetTable";
import ChangeInterval, { Interval } from "@/components/changeInterval";
import ManualTransactionChart from "@/components/manualTransactionChart";
import PortfolioLineChart from "@/components/portfolioLineChart";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { defaultCategories } from "@/constants/category";
import { useData } from "@/contexts/data-context";
import { getUnrealisedProfitLossArray } from "@/helper/unrealisedValueCalculator";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import jaayedaad_logo from "@/public/jaayedaad_logo.svg";
import Image from "next/image";
import AssetMarqueeBar from "@/components/assetMarqueeBar";

function Page({ params }: { params: { asset: string } }) {
  let param = decodeURIComponent(params.asset);
  const { assets, historicalData } = useData();

  const reverseAssetTypeMappings: Record<string, string> = {
    stocks: "common stock",
    crypto: "digital currency",
    // Add other mappings here
  };

  param = reverseAssetTypeMappings[param] || param;

  const filteredAssets = assets?.filter(
    (asset) => asset.type.toLowerCase() === param.toLowerCase()
  );

  if (!filteredAssets?.length) {
    redirect("/dashboard");
  }
  const [assetsToView, setAssetsToView] = useState<Asset[] | undefined>(
    filteredAssets
  );

  const categoryExist = filteredAssets.some(
    (asset) => asset.type.toLowerCase() === param.toLowerCase()
  );

  let manualCategoryAsset: Asset[] | undefined;
  if (categoryExist) {
    manualCategoryAsset = filteredAssets.filter(
      (asset) => asset.type.toLowerCase() === param.toLowerCase()
    );
  }

  const [manualCategoryAssets, setManualCategoryAssets] = useState<
    Asset[] | undefined
  >(manualCategoryAsset);
  const [timeInterval, setTimeInterval] = useState<Interval>("1d");
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

  useEffect(() => {
    async function getPageData() {
      if (filteredAssets) {
        if (!defaultCategories.includes(param)) {
          if (!categoryExist) {
            redirect("/dashboard");
          }
        } else {
          if (
            !filteredAssets.filter(
              (asset) => asset.type.toLowerCase() === param.toLowerCase()
            ).length
          ) {
            redirect("/dashboard");
          } else {
            const conversionRate = await getConversionRate();

            if (historicalData) {
              const unrealisedResults = getUnrealisedProfitLossArray(
                historicalData,
                filteredAssets,
                conversionRate
              );
              setUnrealisedProfitLossArray(unrealisedResults);
            }
          }
        }
      }
    }

    getPageData();
  }, [filteredAssets, param]);

  // Get today's date
  const today = new Date();

  // Subtract one day
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const onChange = (value: Interval) => {
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

  return (
    <div className="px-6 sm:px-8 pt-6 pb-24 lg:py-6 w-full lg:h-screen xl:h-screen flex flex-col">
      <div className="inline-flex justify-between items-center lg:gap-6">
        {assetsToView && (
          <AssetMarqueeBar data={assetsToView} timeInterval={timeInterval} />
        )}
        <Image
          src={jaayedaad_logo}
          alt="Jaayedaad logo"
          className="h-10 lg:hidden"
        />
        <ChangeInterval onChange={onChange} />
      </div>
      <div className="min-h-[85vh] h-full mt-4">
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-6 lg:gap-4 lg:grid lg:grid-rows-7 lg:grid-cols-3 lg:h-full text-foreground">
          <div className="row-span-3 col-span-1 border rounded-xl p-4">
            <AssetPieChart view={param} />
          </div>
          <div className="row-span-3 col-span-2 border rounded-xl p-4">
            {historicalData ? (
              defaultCategories.includes(param) ? (
                <PortfolioLineChart
                  data={historicalData}
                  view={param}
                  timeInterval={timeInterval}
                />
              ) : (
                manualCategoryAssets && (
                  <ManualTransactionChart
                    manualCategoryAssets={manualCategoryAssets}
                    timeInterval={timeInterval}
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
                  Collection of your {param}
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
                  view={param}
                  timelineInterval={timeInterval}
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
  );
}

export default Page;
