"use client";
import { Asset, getAssets } from "@/actions/getAssetsAction";
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
    }
  }, [assets]);

  return assets ? (
    <div className="w-full flex flex-col pt-20 pb-6 px-12">
      <div className="grid grid-cols-6 grid-row-5 gap-6 text-foreground">
        {/* Asset distribution pie chart */}
        <div className="col-span-2 row-span-2 bg-card border rounded-xl p-6">
          {assets && <AssetPieChart data={assets} />}
        </div>
        {/* Portfolio line chart */}
        <div className="col-span-4 row-span-2 bg-card border rounded-xl p-6">
          {assets && <PortfolioLineChart />}
        </div>
        {/* Asset Table */}
        <div className="col-span-4 bg-card border rounded-xl p-6">
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
        <div className="col-span-2 bg-card border rounded-xl p-6">
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
    <div className="mt-64 flex flex-col items-center gap-2">
      <LoadingSpinner />
      Loading your dashboard...
    </div>
  );
}

export default Dashboard;
