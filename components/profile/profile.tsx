"use client";
import { Preference } from "@prisma/client";
import React, { useEffect, useState } from "react";
import AssetPieChart from "../assetPieChart";
import { calculateCurrentValue } from "@/actions/getAssetsAction";
import AssetTable from "../assetTable";
import LoadingSpinner from "../ui/loading-spinner";
import { getHistoricalData } from "@/actions/getHistoricalData";
import PortfolioLineChart from "../portfolioLineChart";
import PerformanceMetrics from "../performanceMetrics";
import { getUnrealisedProfitLossArray } from "@/helper/unrealisedValueCalculator";
import { useCurrency } from "@/contexts/currency-context";
import { calculateRealisedProfitLoss } from "@/helper/realisedValueCalculator";
import { TAsset } from "@/lib/types";

interface ProfileProps {
  preferences: Preference;
}

function Profile({ preferences }: ProfileProps) {
  const { conversionRates } = useCurrency();
  const [assets, setAssets] = useState<TAsset[]>();
  const [historicalData, setHistoricalData] = useState<any[]>();
  const [realisedProfitLoss, setRealisedProfitLoss] = useState<string>();
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
    fetch(`/api/profile/${preferences.userId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(async (data) => {
        const assets: TAsset[] = data;
        if (assets && assets.length) {
          const assetQuotesPromises = assets.map(async (asset) => {
            if (asset.symbol !== null) {
              const quoteResponse = await fetch(
                `https://api.twelvedata.com/quote?symbol=${asset.symbol}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `apikey ${process.env.NEXT_PUBLIC_TWELVEDATA_API_KEY}`,
                  },
                }
              );

              const quote = await quoteResponse.json();

              if (quote.code && quote.code === 404) {
                asset.prevClose = asset.currentPrice;
              } else {
                asset.prevClose = (+quote.previous_close).toFixed(2);
              }
              const values = await calculateCurrentValue(asset);
              asset.currentPrice = values.currentPrice;
              asset.currentValue = values.currentValue;
              asset.compareValue = values.compareValue;
              return asset;
            } else {
              const values = calculateCurrentValue(asset);
              asset.currentPrice = values.currentPrice;
              asset.currentValue = values.currentValue;
              asset.prevClose = values.prevClose;
              asset.compareValue = values.compareValue;
              return asset;
            }
          });

          const updatedAssets = await Promise.all(assetQuotesPromises);
          setAssets(updatedAssets);
          const data = await getHistoricalData(updatedAssets);
          setHistoricalData(data.reverse());
        }
      });
  }, []);

  useEffect(() => {
    if (assets && historicalData?.length && conversionRates) {
      const unrealisedResults = getUnrealisedProfitLossArray(
        historicalData,
        assets,
        conversionRates
      );
      setUnrealisedProfitLossArray(unrealisedResults);
      const realisedProfitLossResults = calculateRealisedProfitLoss(
        assets,
        conversionRates
      );
      setRealisedProfitLoss(
        realisedProfitLossResults.filter(
          (profitLoss) => profitLoss.interval === "All"
        )[0].realisedProfitLoss
      );
    }
  }, [conversionRates, historicalData, assets]);

  // Get today's date
  const today = new Date();

  // Subtract one day
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  console.log(unrealisedProfitLossArray);

  return (
    <div className="grid grid-cols-5 grid-rows-7 h-full gap-6 p-6">
      {preferences.showHoldings && (
        <div className="col-span-2 row-span-3 bg-card border rounded-xl p-6">
          <AssetPieChart view="dashboard" assets={assets} />
        </div>
      )}
      {/* Performance */}
      {preferences.showMetrics && (
        <div className="col-span-3 row-span-3 bg-card border rounded-xl p-6">
          {historicalData ? (
            historicalData.length ? (
              <PortfolioLineChart
                data={historicalData}
                view="dashboard"
                timeInterval="All"
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
      {preferences.showHoldings && (
        <div className="col-span-3 row-span-4 bg-card border rounded-xl p-6">
          <div className="flex justify-between">
            <div className="xl:flex xl:items-center xl:gap-1">
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
          <div className="mt-6">
            {assets ? (
              <AssetTable data={assets} isPublic />
            ) : (
              <div className="h-64 flex items-center">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </div>
      )}
      {/* Metrics */}
      {preferences.showMetrics && (
        <div className="col-span-2 row-span-4 bg-card border rounded-xl p-6">
          <h3 className="font-semibold">Performance Metrics</h3>
          <p className="text-muted-foreground text-xs xl:text-sm">
            Analyze investment performance
          </p>
          {assets && unrealisedProfitLossArray ? (
            <PerformanceMetrics
              assets={assets}
              realisedProfitLoss={realisedProfitLoss}
              unrealisedProfitLossArray={unrealisedProfitLossArray}
              timeInterval="All"
            />
          ) : (
            <div className="h-72 w-full flex items-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
