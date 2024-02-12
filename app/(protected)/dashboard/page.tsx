"use client";
import { Asset, getAssets } from "@/actions/getAssetsAction";
import { getHistoricalData } from "@/actions/getHistoricalData";
import AssetPieChart from "@/components/assetPieChart";
import AssetTable from "@/components/assetTable";
import PerformanceMetrics from "@/components/performanceMetrics";
import PortfolioLineChart from "@/components/portfolioLineChart";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { calculateRealisedProfitLoss } from "@/helper/realisedValueCalculator";
import { calculateUnrealisedProfitLoss } from "@/helper/unrealisedValueCalculator";
import { useEffect, useState } from "react";

function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>();
  const [unrealisedProfitLoss, setUnrealisedProfitLoss] = useState<number>();
  const [realisedProfitLoss, setRealisedProfitLoss] = useState<number>();
  const [historicalData, setHistoricalData] = useState<any[]>();
  const [loadingAsset, setLoadingAsset] = useState(true);

  useEffect(() => {
    getAssets().then((assets) => {
      setAssets(assets);
      setLoadingAsset(false);
    });
  }, []);

  useEffect(() => {
    if (assets) {
      const unrealizedProfitsLosses = calculateUnrealisedProfitLoss(assets);
      setUnrealisedProfitLoss(unrealizedProfitsLosses);
      const realizedProfitsLosses = calculateRealisedProfitLoss(assets);
      setRealisedProfitLoss(realizedProfitsLosses);
      getHistoricalData(assets).then((data) => {
        setHistoricalData(data.reverse());
      });
    }
  }, [assets]);

  return assets ? (
    <div className="w-full flex flex-col py-6 px-6">
      <div className="grid grid-cols-6 grid-row-5 gap-6 text-foreground">
        {/* Asset distribution pie chart */}
        <div className="col-span-2 row-span-2 bg-card border rounded-xl p-4">
          {assets && <AssetPieChart data={assets} />}
        </div>
        {/* Portfolio line chart */}
        <div className="col-span-4 row-span-2 bg-card border rounded-xl p-4">
          {historicalData && <PortfolioLineChart data={historicalData} />}
        </div>
        {/* Asset Table */}
        <div className="col-span-4 bg-card border rounded-xl p-4">
          <h3 className="font-semibold">Asset Overview</h3>
          <p className="text-muted-foreground text-sm">
            Comprehensive list of your owned assets
          </p>
          <div className="mt-6">
            {loadingAsset ? (
              <LoadingSpinner />
            ) : (
              assets && <AssetTable assets={assets} />
            )}
          </div>
        </div>
        {/* Performance metrics */}
        <div className="col-span-2 bg-card border rounded-xl p-4">
          <h3 className="font-semibold">Performance Metrics</h3>
          <p className="text-muted-foreground text-sm">
            Analyzing Your Investment Performance
          </p>
          {assets && (
            <PerformanceMetrics
              assets={assets}
              realisedProfitLoss={realisedProfitLoss}
              unrealisedProfitLoss={unrealisedProfitLoss}
            />
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
