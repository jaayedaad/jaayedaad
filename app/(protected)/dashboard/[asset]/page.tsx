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

function Page({ params }: { params: { asset: string } }) {
  const param = decodeURIComponent(params.asset);
  const { assets, historicalData } = useData();

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
    <div className="px-6 py-6 w-full h-screen flex flex-col">
      <div className="inline-flex justify-end">
        <ChangeInterval onChange={onChange} />
      </div>
      <div className="min-h-[85vh] h-full mt-4">
        <div className="grid grid-rows-7 grid-cols-3 gap-4 h-full">
          <div className="row-span-3 col-span-1 border rounded-xl p-4">
            <AssetPieChart view={params.asset} />
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
              <div className="flex items-center gap-1">
                <h3 className="font-semibold">Asset Overview</h3>
                <p className="text-muted-foreground text-sm">
                  (Comprehensive list of your owned {param})
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  Last update on ({yesterday.toLocaleDateString("en-GB")})
                </p>
              </div>
            </div>
            <div className="mt-6">
              {assetsToView ? (
                <AssetTable data={assetsToView} view={param} />
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
