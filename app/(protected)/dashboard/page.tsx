"use client";
import { getConversionRate } from "@/actions/getConversionRateAction";
import AssetPieChart from "@/components/assetPieChart";
import AssetTable from "@/components/assetTable";
import ChangeInterval, { Interval } from "@/components/changeInterval";
import PerformanceMetrics from "@/components/performanceMetrics";
import PortfolioLineChart from "@/components/portfolioLineChart";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useCurrency } from "@/contexts/currency-context";
import { useData } from "@/contexts/data-context";
import {
  ProfitLoss,
  calculateRealisedProfitLoss,
} from "@/helper/realisedValueCalculator";
import {
  calculateUnrealisedProfitLoss,
  getUnrealisedProfitLossArray,
} from "@/helper/unrealisedValueCalculator";
import { useEffect, useState } from "react";

function Dashboard() {
  const { defaultCurrency, conversionRates } = useCurrency();
  const [unrealisedProfitLoss, setUnrealisedProfitLoss] = useState<number>();
  const [realisedProfitLoss, setRealisedProfitLoss] = useState<string>();
  const [timeInterval, setTimeInterval] = useState<Interval>("All");
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
  const [realisedProfitLossArray, setRealisedProfitLossArray] =
    useState<ProfitLoss[]>();
  const { assets, historicalData } = useData();

  useEffect(() => {
    async function calculateProfitLoss() {
      if (assets && conversionRates) {
        if (historicalData) {
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
    }

    calculateProfitLoss();
  }, [assets, timeInterval, historicalData, defaultCurrency, conversionRates]);

  // Get today's date
  const today = new Date();

  // Subtract one day
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const onChange = (value: Interval) => {
    setTimeInterval(value);
    if (value === "All" && assets && conversionRates) {
      const unrealisedProfitsLosses = calculateUnrealisedProfitLoss(
        assets,
        conversionRates
      );
      setUnrealisedProfitLoss(unrealisedProfitsLosses);
    } else {
      const filteredUnrealizedProfitsLosses = unrealisedProfitLossArray?.filter(
        (res) => res.interval === value
      );
      const unrealisedProfitLoss = filteredUnrealizedProfitsLosses?.reduce(
        (acc, entry) => acc + parseFloat(entry.unrealisedProfitLoss),
        0
      );

      setUnrealisedProfitLoss(unrealisedProfitLoss);
    }
    const profitLoss = realisedProfitLossArray?.filter(
      (profitLoss) => profitLoss.interval === value
    )[0].realisedProfitLoss;
    setRealisedProfitLoss(profitLoss);
  };

  return assets ? (
    <div className="px-6 py-6 w-full h-screen flex flex-col">
      <div className="inline-flex justify-end">
        <ChangeInterval onChange={onChange} />
      </div>
      <div className="min-h-[85vh] h-full mt-4">
        <div className="grid grid-rows-7 grid-cols-3 gap-4 h-full text-foreground">
          {/* Asset distribution pie chart */}
          <div className="col-span-1 row-span-3 bg-card border rounded-xl p-4">
            <AssetPieChart view="dashboard" />
          </div>
          {/* Portfolio line chart */}
          <div className="col-span-2 row-span-3 bg-card border rounded-xl p-4">
            {historicalData ? (
              historicalData.length ? (
                <PortfolioLineChart
                  data={historicalData}
                  view="dashboard"
                  timeInterval={timeInterval}
                />
              ) : (
                <div>
                  <h3 className="font-semibold">Portfolio Performance</h3>
                  <p className="text-muted-foreground text-sm">
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
                <p className="text-muted-foreground text-sm">
                  Insight into your portfolio&apos;s value dynamics
                </p>
                <div className="h-40 flex items-center">
                  <LoadingSpinner />
                </div>
              </div>
            )}
          </div>
          {/* Asset Table */}
          <div className="col-span-2 row-span-4 bg-card border rounded-xl p-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold">Asset Overview</h3>
                <p className="text-muted-foreground text-sm">
                  (Comprehensive list of your owned assets)
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  Last update on ({yesterday.toLocaleDateString("en-GB")})
                </p>
              </div>
            </div>
            <div className="mt-6">
              {assets ? (
                <AssetTable
                  data={assets}
                  timelineInterval={timeInterval}
                  intervalChangeData={unrealisedProfitLossArray}
                />
              ) : (
                <div className="h-64 flex items-center">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          </div>
          {/* Performance metrics */}
          <div className="col-span-1 row-span-4 bg-card border rounded-xl p-4">
            <h3 className="font-semibold">Performance Metrics</h3>
            <p className="text-muted-foreground text-sm">
              Analyzing Your Investment Performance
            </p>
            {assets ? (
              <PerformanceMetrics
                assets={assets}
                realisedProfitLoss={realisedProfitLoss}
                unrealisedProfitLoss={unrealisedProfitLoss}
              />
            ) : (
              <div className="h-72 w-full flex items-center">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center gap-2 w-full h-auto">
      <LoadingSpinner />
      <div>Loading your dashboard...</div>
    </div>
  );
}

export default Dashboard;
