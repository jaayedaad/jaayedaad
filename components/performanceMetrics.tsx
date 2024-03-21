import { Asset } from "@/actions/getAssetsAction";
import { useCurrency } from "@/contexts/currency-context";
import { useVisibility } from "@/contexts/visibility-context";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Interval } from "./changeInterval";
import { calculateUnrealisedProfitLoss } from "@/helper/unrealisedValueCalculator";

function PerformanceMetrics({
  assets,
  realisedProfitLoss,
  unrealisedProfitLossArray,
  timeInterval,
}: {
  assets: Asset[];
  realisedProfitLoss: string | undefined;
  unrealisedProfitLossArray: {
    type: string;
    symbol: string;
    compareValue: string;
    currentValue: string;
    prevClose: string;
    interval: string;
    unrealisedProfitLoss: string;
  }[];
  timeInterval: Interval;
}) {
  const { visible } = useVisibility();
  const { conversionRates, numberSystem, defaultCurrency } = useCurrency();
  const [unrealisedProfitLoss, setUnrealisedProfitLoss] = useState<number>();

  useEffect(() => {
    if (timeInterval === "All" && assets && conversionRates) {
      const unrealisedProfitsLosses = calculateUnrealisedProfitLoss(
        assets,
        conversionRates
      );
      setUnrealisedProfitLoss(unrealisedProfitsLosses);
    } else {
      const filteredUnrealizedProfitsLosses = unrealisedProfitLossArray?.filter(
        (res) => res.interval === timeInterval
      );
      const unrealisedProfitLoss = filteredUnrealizedProfitsLosses?.reduce(
        (acc, entry) => acc + parseFloat(entry.unrealisedProfitLoss),
        0
      );

      setUnrealisedProfitLoss(unrealisedProfitLoss);
    }
  }, [assets, conversionRates, timeInterval, unrealisedProfitLossArray]);
  const formatter = new Intl.NumberFormat(
    numberSystem === "Indian" ? "en-IN" : "en-US",
    {
      style: "currency",
      currency: defaultCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground text-xs">Current Value</p>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold">
              {visible
                ? conversionRates &&
                  formatter.format(
                    parseFloat(
                      assets
                        ?.reduce((acc, asset) => {
                          const assetCurrency = asset.buyCurrency.toLowerCase();
                          const currencyConversion =
                            conversionRates[assetCurrency];
                          const multiplier = 1 / currencyConversion;
                          return (
                            acc +
                            (asset.quantity > "0"
                              ? asset.symbol
                                ? asset.currentValue * multiplier
                                : +asset.currentPrice * multiplier || 0
                              : 0)
                          );
                        }, 0)
                        .toFixed(2)
                    )
                  )
                : "* ".repeat(5)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="p-3 rounded-md border w-full">
          <p className="text-sm flex items-center justify-between mb-2">
            Unrealised Profit / Loss
            <div className="text-base">
              {
                formatter
                  .formatToParts(0)
                  .find((part) => part.type === "currency")?.value
              }
            </div>
          </p>
          <div
            className={cn(
              "flex items-center gap-1",
              unrealisedProfitLoss && unrealisedProfitLoss < 0
                ? "text-red-400"
                : "text-green-400"
            )}
          >
            <div className="text-2xl font-bold">
              {unrealisedProfitLoss && (
                <div className="flex items-center">
                  {conversionRates &&
                    (
                      (unrealisedProfitLoss * 100) /
                      +assets.reduce((acc, asset) => {
                        const assetCurrency = asset.buyCurrency.toLowerCase();
                        const currencyConversion =
                          conversionRates[assetCurrency];
                        const multiplier = 1 / currencyConversion;
                        return acc + (asset.compareValue * multiplier || 0);
                      }, 0)
                    ).toFixed(2) + "%"}
                  {unrealisedProfitLoss > 0 ? <ArrowUp /> : <ArrowDown />}
                </div>
              )}
              <div className="text-sm flex items-center">
                {unrealisedProfitLoss &&
                  (visible
                    ? formatter.format(unrealisedProfitLoss)
                    : "* ".repeat(5))}
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 rounded-md border w-full">
          <p className="text-sm flex items-center justify-between mb-2">
            Realised Profit / Loss
            <div className="text-base">
              {
                formatter
                  .formatToParts(0)
                  .find((part) => part.type === "currency")?.value
              }
            </div>
          </p>
          <div
            className={cn(
              "flex items-center gap-1",
              realisedProfitLoss && +realisedProfitLoss < 0
                ? "text-red-400"
                : "text-green-400"
            )}
          >
            <span className="text-2xl font-bold">
              {visible
                ? realisedProfitLoss && formatter.format(+realisedProfitLoss)
                : "* ".repeat(5)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceMetrics;
