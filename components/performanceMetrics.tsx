"use client";

import {
  TAsset,
  TConversionRates,
  TInterval,
  TProfitLoss,
} from "@/types/types";
import { cn } from "@/lib/helper";
import { ArrowDown, ArrowUp } from "lucide-react";
import React, { useEffect, useState } from "react";

function PerformanceMetrics({
  assets,
  realisedProfitLossArray,
  unrealisedProfitLossArray,
  timeInterval,
  dashboardAmountVisibility,
  numberSystem,
  defaultCurrency,
  conversionRates,
}: {
  assets: TAsset[];
  realisedProfitLossArray: TProfitLoss[];
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
  const [realisedProfitLoss, setRealisedProfitLoss] = useState<number>();

  useEffect(() => {
    const filteredUnrealizedProfitsLosses = unrealisedProfitLossArray?.filter(
      (res) => res.interval === timeInterval
    );
    const filteredRealizedProfitsLosses = realisedProfitLossArray?.filter(
      (res) => res.interval === timeInterval
    );

    const unrealisedProfitLoss = filteredUnrealizedProfitsLosses?.reduce(
      (acc, entry) => acc + parseFloat(entry.unrealisedProfitLoss),
      0
    );
    const realisedProfitLoss = filteredRealizedProfitsLosses?.reduce(
      (acc, entry) => acc + parseFloat(entry.realisedProfitLoss),
      0
    );

    setUnrealisedProfitLoss(unrealisedProfitLoss);
    setRealisedProfitLoss(realisedProfitLoss);
  }, [timeInterval, unrealisedProfitLossArray, realisedProfitLossArray]);
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
    <div>
      <div className="flex justify-between items-center mb-1">
        <div>
          <p className="text-muted-foreground text-xs">Current Value</p>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">
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
            <div className="text-xl font-bold">
              {unrealisedProfitLoss ? (
                <div className="flex items-center">
                  {conversionRates &&
                    (
                      (unrealisedProfitLoss * 100) /
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
                {unrealisedProfitLoss !== undefined
                  ? dashboardAmountVisibility
                    ? formatter.format(unrealisedProfitLoss)
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
            <span className="text-xl font-bold">
              {realisedProfitLoss !== undefined
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
