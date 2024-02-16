"use client";
import AssetPieChart from "@/components/assetPieChart";
import AssetTable from "@/components/assetTable";
import PerformanceMetrics from "@/components/performanceMetrics";
import PortfolioLineChart from "@/components/portfolioLineChart";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useData } from "@/contexts/data-context";
import { calculateRealisedProfitLoss } from "@/helper/realisedValueCalculator";
import { calculateUnrealisedProfitLoss } from "@/helper/unrealisedValueCalculator";
import { useEffect, useState } from "react";

function Dashboard() {
  const [unrealisedProfitLoss, setUnrealisedProfitLoss] = useState<number>();
  const [realisedProfitLoss, setRealisedProfitLoss] = useState<number>();
  const [loadingAsset, setLoadingAsset] = useState(true);
  const { assets, historicalData } = useData();

  useEffect(() => {
    if (assets) {
      setLoadingAsset(false);
      const unrealizedProfitsLosses = calculateUnrealisedProfitLoss(assets);
      setUnrealisedProfitLoss(unrealizedProfitsLosses);
      const realizedProfitsLosses = calculateRealisedProfitLoss(assets);
      setRealisedProfitLoss(realizedProfitsLosses);
    }
  }, [assets]);

  // Get today's date
  const today = new Date();

  // Subtract one day
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return assets ? (
    <div className="px-6 py-6 w-full h-screen flex flex-col">
      <div className="grid grid-cols-6 grid-row-5 gap-4 h-full text-foreground">
        {/* Asset distribution pie chart */}
        <div className="col-span-2 row-span-2 bg-card border rounded-xl p-4">
          <AssetPieChart view="dashboard" />
        </div>
        {/* Portfolio line chart */}
        <div className="col-span-4 row-span-2 bg-card border rounded-xl p-4">
          {historicalData ? (
            <PortfolioLineChart data={historicalData} view="dashboard" />
          ) : (
            <div>
              <h3 className="font-semibold">Portfolio Performance</h3>
              <p className="text-muted-foreground text-sm">
                Insight into your portfolio&apos;s value dynamics
              </p>
              <LoadingSpinner />
            </div>
          )}
        </div>
        {/* Asset Table */}
        <div className="col-span-4 row-span-3 bg-card border rounded-xl p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">Asset Overview</h3>
              <p className="text-muted-foreground text-sm">
                Comprehensive list of your owned assets
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                Last update on ({yesterday.toLocaleDateString()})
              </p>
            </div>
          </div>
          <div className="mt-6">
            {loadingAsset ? (
              <LoadingSpinner />
            ) : (
              assets && <AssetTable data={assets} />
            )}
          </div>
        </div>
        {/* Performance metrics */}
        <div className="col-span-2 row-span-3 bg-card border rounded-xl p-4">
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
            <LoadingSpinner />
          )}
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
