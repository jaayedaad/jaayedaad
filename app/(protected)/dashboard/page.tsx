"use client";
import AssetPieChart from "@/components/assetPieChart";
import AssetTable from "@/components/assetTable";
import PerformanceMetrics from "@/components/performanceMetrics";
import PortfolioLineChart from "@/components/portfolioLineChart";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useHistoricalData } from "@/contexts/historicalData-context";
import { calculateRealisedProfitLoss } from "@/helper/realisedValueCalculator";
import { calculateUnrealisedProfitLoss } from "@/helper/unrealisedValueCalculator";
import { useEffect, useState } from "react";

function Dashboard() {
  const [unrealisedProfitLoss, setUnrealisedProfitLoss] = useState<number>();
  const [realisedProfitLoss, setRealisedProfitLoss] = useState<number>();
  const [loadingAsset, setLoadingAsset] = useState(true);
  const { assets, historicalData } = useHistoricalData();

  useEffect(() => {
    if (assets) {
      setLoadingAsset(false);
      const unrealizedProfitsLosses = calculateUnrealisedProfitLoss(assets);
      setUnrealisedProfitLoss(unrealizedProfitsLosses);
      const realizedProfitsLosses = calculateRealisedProfitLoss(assets);
      setRealisedProfitLoss(realizedProfitsLosses);
    }
  }, [assets]);

  return assets ? (
    <div className="px-6 py-6 w-full h-screen flex flex-col">
      <div className="grid grid-cols-6 grid-row-5 gap-4 h-full text-foreground">
        {/* Asset distribution pie chart */}
        <div className="col-span-2 row-span-2 bg-card border rounded-xl p-4">
          {assets && <AssetPieChart data={assets} />}
        </div>
        {/* Portfolio line chart */}
        <div className="col-span-4 row-span-2 bg-card border rounded-xl p-4">
          {historicalData && (
            <PortfolioLineChart data={historicalData} view="dashboard" />
          )}
        </div>
        {/* Asset Table */}
        <div className="col-span-4 row-span-3 bg-card border rounded-xl p-4">
          <h3 className="font-semibold">Asset Overview</h3>
          <p className="text-muted-foreground text-sm">
            Comprehensive list of your owned assets
          </p>
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
