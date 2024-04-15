import React, { useEffect } from "react";
import Marquee from "react-fast-marquee";
import { TAsset, TInterval, TPreference } from "@/lib/types";
import { cn } from "@/lib/helper";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface AssetMarqueeBarProps {
  assets: TAsset[];
  timeInterval: TInterval;
  preferences: TPreference;
}

function AssetMarqueeBar({
  assets: assets,
  timeInterval,
  preferences,
}: AssetMarqueeBarProps) {
  useEffect(() => {}, [timeInterval]);

  // Sort data based on performanceBarOrder
  const sortedData = [...assets].sort((a, b) => {
    let aValue: number, bValue: number;

    switch (preferences.performanceBarParameter) {
      case "totalInvestment":
        aValue = a.compareValue;
        bValue = b.compareValue;
        break;
      case "totalValue":
        aValue = a.currentValue;
        bValue = b.currentValue;
        break;
      case "percentageChange":
      default:
        aValue = ((a.currentValue - a.compareValue) * 100) / a.compareValue;
        bValue = ((b.currentValue - b.compareValue) * 100) / b.compareValue;
        break;
    }

    if (preferences.performanceBarOrder === "Ascending") {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  return (
    <div className="hidden lg:block w-full">
      <Marquee gradient gradientColor="hsl(--background)" speed={150}>
        <div className="flex gap-6">
          {assets.map((asset) => {
            if (asset === null) return null;
            let value, isIncrease, isPercentage;

            switch (preferences.performanceBarParameter) {
              case "totalInvestment":
                value = asset.compareValue;
                isIncrease = asset.currentValue > asset.compareValue;
                isPercentage = false;
                break;
              case "totalValue":
                value = asset.currentValue;
                isIncrease = asset.currentValue > asset.compareValue;
                isPercentage = false;
                break;
              case "percentageChange":
              default:
                value =
                  ((asset.currentValue - asset.compareValue) * 100) /
                  asset.compareValue;
                isIncrease = asset.currentValue > asset.compareValue;
                isPercentage = true;
                break;
            }

            return (
              <div key={asset.id} className="flex items-end gap-2">
                <div>{asset.name}</div>
                <div
                  className={cn(
                    "flex items-center text-sm",
                    isIncrease ? "text-green-400" : "text-red-400"
                  )}
                >
                  {value.toFixed(2)}
                  {isPercentage && "%"}
                  {isIncrease ? (
                    <ArrowUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Marquee>
    </div>
  );
}

export default AssetMarqueeBar;
