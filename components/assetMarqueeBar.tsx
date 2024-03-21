import React, { useEffect } from "react";
import Marquee from "react-fast-marquee";
import { Interval } from "./changeInterval";
import { Asset } from "@/actions/getAssetsAction";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface AssetMarqueeBarProps {
  data: Asset[];
  timeInterval: Interval;
}

function AssetMarqueeBar({ data, timeInterval }: AssetMarqueeBarProps) {
  useEffect(() => {}, [timeInterval]);
  return (
    <div className="hidden lg:block w-full">
      <Marquee gradient gradientColor="black">
        <div className="flex gap-6">
          {data.map((asset, index) => {
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
