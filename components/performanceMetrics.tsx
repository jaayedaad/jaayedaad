"use client";

import { TAsset, TConversionRates, TInterval } from "@/lib/types";
import { cn } from "@/lib/helper";
import { ArrowDown, ArrowUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { calculateUnrealisedProfitLoss } from "@/helper/unrealisedValueCalculator";

function PerformanceMetrics({
  assets,
  realisedProfitLoss,
  unrealisedProfitLossArray,
  timeInterval,
  dashboardAmountVisibility,
  numberSystem,
  defaultCurrency,
  conversionRates,
}: {
  assets: TAsset[];
  realisedProfitLoss: string | undefined;
  unrealisedProfitLossArray?: {
    category: string;
    symbol: string;
    compareValue: string;
    currentValue: string;
    valueAtInterval: number;
    prevClose: string;
    interval: string;
    unrealisedProfitLoss: string;
  }[];
  timeInterval: TInterval;
  dashboardAmountVisibility: boolean;
  numberSystem: string;
  defaultCurrency: string;
  conversionRates: TConversionRates;
}) {
  const [unrealisedProfitLoss, setUnrealisedProfitLoss] = useState<number>();

  useEffect(() => {
    if (timeInterval === "All" && assets && conversionRates) {
      const unrealisedProfitsLosses = calculateUnrealisedProfitLoss(assets);
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
      currency: defaultCurrency || "inr",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-muted-foreground text-xs">Current Value</p>
          <div className="flex items-center gap-1">
            <span className="text-xl lg:text-2xl font-bold">
              {conversionRates && assets.length
                ? dashboardAmountVisibility
                  ? formatter.format(
                      parseFloat(
                        assets
                          .reduce((acc, asset) => {
                            const assetCurrency =
                              asset.buyCurrency.toLowerCase();
                            const currencyConversion =
                              conversionRates[assetCurrency];
                            const multiplier = 1 / currencyConversion;
                            return (
                              acc +
                              (asset.quantity > "0"
                                ? asset.currentValue * multiplier
                                : 0)
                            );
                          }, 0)
                          .toFixed(2)
                      )
                    )
                  : "* ".repeat(5)
                : "- - -"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="p-2 rounded-md border w-full">
          <p className="text-sm flex items-center justify-between mb-2">
            Unrealised Profit / Loss
            <span className="text-base">
              {
                formatter
                  .formatToParts(0)
                  .find((part) => part.type === "currency")?.value
              }
            </span>
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
              {unrealisedProfitLoss ? (
                <div className="flex items-center">
                  {conversionRates &&
                    (
                      (assets.reduce((acc, asset) => {
                        const assetCurrency = asset.buyCurrency.toLowerCase();
                        const currencyConversion =
                          conversionRates[assetCurrency];
                        const multiplier = 1 / currencyConversion;
                        return (
                          acc +
                          (asset.quantity > "0"
                            ? (asset.currentValue - asset.compareValue) *
                              multiplier
                            : 0)
                        );
                      }, 0) *
                        100) /
                      assets.reduce((acc, asset) => {
                        const assetCurrency = asset.buyCurrency.toLowerCase();
                        const currencyConversion =
                          conversionRates[assetCurrency];
                        const multiplier = 1 / currencyConversion;
                        return (
                          acc +
                          (asset.quantity > "0"
                            ? asset.compareValue * multiplier
                            : 0)
                        );
                      }, 0)
                    ).toFixed(2) + "%"}
                  {unrealisedProfitLoss > 0 ? <ArrowUp /> : <ArrowDown />}
                </div>
              ) : (
                "- - -"
              )}
              <div className="text-sm flex items-center">
                {unrealisedProfitLoss
                  ? dashboardAmountVisibility
                    ? formatter.format(
                        +assets
                          .reduce((acc, asset) => {
                            const assetCurrency =
                              asset.buyCurrency.toLowerCase();
                            const currencyConversion =
                              conversionRates[assetCurrency];
                            const multiplier = 1 / currencyConversion;
                            return (
                              acc +
                              (asset.quantity > "0"
                                ? (asset.currentValue - asset.compareValue) *
                                  multiplier
                                : 0)
                            );
                          }, 0)
                          .toFixed(2)
                      )
                    : "* ".repeat(5)
                  : "- - -"}
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 rounded-md border w-full">
          <p className="text-sm flex items-center justify-between mb-2">
            Realised Profit / Loss
            <span className="text-base">
              {
                formatter
                  .formatToParts(0)
                  .find((part) => part.type === "currency")?.value
              }
            </span>
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
              {assets.length && realisedProfitLoss
                ? dashboardAmountVisibility
                  ? formatter.format(+realisedProfitLoss)
                  : "* ".repeat(5)
                : "- - -"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceMetrics;
