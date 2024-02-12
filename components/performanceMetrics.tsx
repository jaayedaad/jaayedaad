import { Asset } from "@/actions/getAssetsAction";
import { cn } from "@/lib/utils";
import { IndianRupee } from "lucide-react";
import React from "react";

function PerformanceMetrics({
  assets,
  unrealisedProfitLoss,
  realisedProfitLoss,
}: {
  assets: Asset[];
  unrealisedProfitLoss: number | undefined;
  realisedProfitLoss: number | undefined;
}) {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground text-xs">Current Value</p>
          <div className="flex items-center gap-1">
            <IndianRupee className="h-6 w-6" strokeWidth={3} />
            <span className="text-2xl font-bold">
              {assets
                ?.reduce((acc, asset) => acc + (asset.currentValue || 0), 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="p-3 rounded-md border w-full">
          <p className="text-sm flex items-center justify-between mb-2">
            Unrealised Profit / Loss <IndianRupee className="h-4 w-4" />
          </p>
          <div
            className={cn(
              "flex items-center gap-1",
              unrealisedProfitLoss && unrealisedProfitLoss < 0
                ? "text-red-400"
                : "text-green-400"
            )}
          >
            <IndianRupee className="h-6 w-6" strokeWidth={3} />
            <span className="text-2xl font-bold">
              {unrealisedProfitLoss?.toFixed(2)?.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="p-3 rounded-md border w-full">
          <p className="text-sm flex items-center justify-between mb-2">
            Realised Profit / Loss <IndianRupee className="h-4 w-4" />
          </p>
          <div
            className={cn(
              "flex items-center gap-1",
              realisedProfitLoss && realisedProfitLoss < 0
                ? "text-red-400"
                : "text-green-400"
            )}
          >
            <IndianRupee className="h-6 w-6" strokeWidth={3} />
            <span className="text-2xl font-bold">
              {realisedProfitLoss?.toFixed(2)?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceMetrics;
