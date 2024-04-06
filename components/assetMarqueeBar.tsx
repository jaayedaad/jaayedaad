import React, { useEffect } from "react";
import Marquee from "react-fast-marquee";
import { TAsset, TInterval } from "@/lib/types";
import { cn } from "@/lib/helper";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface AssetMarqueeBarProps {
  data: TAsset[];
  timeInterval: TInterval;
  performanceBarOrder: string;
}

function AssetMarqueeBar({
  data,
  timeInterval,
  performanceBarOrder,
}: AssetMarqueeBarProps) {
  useEffect(() => {}, [timeInterval]);

  // Sort data based on performanceBarOrder
  const sortedData = [...data].sort((a, b) => {
    const aChange = ((a.currentValue - a.compareValue) * 100) / a.compareValue;
    const bChange = ((b.currentValue - b.compareValue) * 100) / b.compareValue;

    if (performanceBarOrder === "Ascending") {
      return aChange - bChange;
    } else {
      return bChange - aChange;
    }
  });

  return (
    <div className="hidden lg:block w-full">
      <Marquee gradient gradientColor="hsl(--background)">
        <div className="flex gap-6">
          {sortedData.map((asset, index) => {
            return (
              <div key={index} className="flex gap-2">
                <div>{asset.name}:</div>
                <div
                  className={cn(
                    "flex items-center text-sm",
                    asset.currentValue > asset.compareValue
                      ? "text-green-400"
                      : "text-red-400"
                  )}
                >
                  {(
                    ((asset.currentValue - asset.compareValue) * 100) /
                    asset.compareValue
                  ).toFixed(2)}
                  %
                  {asset.currentValue > asset.compareValue ? (
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
