import { Asset } from "@/actions/getAssetsAction";
import { useCurrency } from "@/contexts/currency-context";
import { useVisibility } from "@/contexts/visibility-context";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, IndianRupee } from "lucide-react";
import React from "react";

function PerformanceMetrics({
  assets,
  unrealisedProfitLoss,
  realisedProfitLoss,
}: {
  assets: Asset[];
  unrealisedProfitLoss: number | undefined;
  realisedProfitLoss: string | undefined;
}) {
  const { visible } = useVisibility();
  const { conversionRates } = useCurrency();

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground text-xs">Current Value</p>
          <div className="flex items-center gap-1">
            <IndianRupee className="h-6 w-6" strokeWidth={3} />
            <span className="text-2xl font-bold">
              {visible
                ? conversionRates &&
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
                  ).toLocaleString("en-IN")
                : "* ".repeat(5)}
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
                <IndianRupee className="h-3 w-3" />
                {unrealisedProfitLoss &&
                  (visible
                    ? unrealisedProfitLoss.toLocaleString("en-IN")
                    : "* ".repeat(5))}
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 rounded-md border w-full">
          <p className="text-sm flex items-center justify-between mb-2">
            Realised Profit / Loss <IndianRupee className="h-4 w-4" />
          </p>
          <div
            className={cn(
              "flex items-center gap-1",
              realisedProfitLoss && +realisedProfitLoss < 0
                ? "text-red-400"
                : "text-green-400"
            )}
          >
            <IndianRupee className="h-6 w-6" strokeWidth={3} />
            <span className="text-2xl font-bold">
              {visible
                ? realisedProfitLoss &&
                  parseFloat((+realisedProfitLoss).toFixed(2)).toLocaleString(
                    "en-IN"
                  )
                : "* ".repeat(5)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceMetrics;
