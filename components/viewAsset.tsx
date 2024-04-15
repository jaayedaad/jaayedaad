import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent } from "./ui/dialog";
import { cn } from "@/lib/helper";
import { accumulateLineChartData } from "@/helper/lineChartDataAccumulator";
import ChangeInterval from "./changeInterval";
import AssetLineChart from "./assetLineChart";
import { prepareLineChartData } from "@/helper/prepareLineChartData";
import TransactionHistory from "./transactionHistory";
import { prepareHistoricalDataForManualCategory } from "@/helper/manualAssetsHistoryMaker";
import { TAsset, TInterval, TProfitLoss } from "@/lib/types";
import AssetPriceUpdates from "./assetPriceUpdates";
import {
  calculateUnrealisedProfitLoss,
  getUnrealisedProfitLossArray,
} from "@/helper/unrealisedValueCalculator";
import { calculateRealisedProfitLoss } from "@/helper/realisedValueCalculator";
import LoadingSpinner from "./ui/loading-spinner";

interface ViewAssetProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assetToView?: TAsset;
  manualAsset?: TAsset;
  historicalData: any[];
  conversionRates: {
    [currency: string]: number;
  };
  numberSystem: string;
  defaultCurrency: string;
}

function ViewAsset({
  open,
  setOpen,
  assetToView,
  manualAsset,
  historicalData,
  conversionRates,
  numberSystem,
  defaultCurrency,
}: ViewAssetProps) {
  const [dataToShow, setDataToShow] = useState<
    {
      name: string;
      amt: number;
    }[]
  >();
  const [currentValue, setCurrentValue] = useState("");
  const [investedValue, setInvestedValue] = useState("");
  const [compareLabel, setCompareLabel] = useState("");
  const [assetSummary, setAssetSummary] = useState<{
    unrealisedProfitLoss: string;
    realisedProfitLoss: string;
  }>();
  const [realisedProfitLossArray, setRealisedProfitLossArray] =
    useState<TProfitLoss[]>();
  const [unrealisedProfitLossArray, setUnrealisedProfitLossArray] = useState<
    {
      category: string;
      symbol: string;
      compareValue: string;
      currentValue: string;
      valueAtInterval: number;
      prevClose: string;
      interval: string;
      unrealisedProfitLoss: string;
    }[]
  >();

  const assetHistory: any[] = [];
  if (assetToView) {
    assetHistory.push(
      historicalData.find((data) => data.assetSymbol === assetToView?.symbol)
    );
  }
  if (manualAsset) {
    const manualHistory = prepareHistoricalDataForManualCategory(
      [manualAsset],
      conversionRates
    );
    assetHistory.splice(0, assetHistory.length, ...manualHistory);
  }
  const lineChartData = accumulateLineChartData(assetHistory);

  useEffect(() => {
    async function fetchData() {
      const asset = assetToView || manualAsset;
      if (asset) {
        const unrealisedResults = getUnrealisedProfitLossArray(
          historicalData,
          [asset],
          conversionRates
        );
        setUnrealisedProfitLossArray(unrealisedResults);
        const realisedProfitLossResults = calculateRealisedProfitLoss(
          [asset],
          conversionRates
        );
        setRealisedProfitLossArray(realisedProfitLossResults);
        const currentValue = unrealisedResults.filter(
          (res) => res.interval === "All"
        )[0].currentValue;
        const investedValue = unrealisedResults.filter(
          (res) => res.interval === "All"
        )[0].compareValue;
        const valueAtAllInterval = unrealisedResults.filter(
          (res) => res.interval === "All"
        )[0].valueAtInterval;
        setCurrentValue(currentValue);
        setInvestedValue(investedValue);
        setCompareLabel((+currentValue - valueAtAllInterval).toFixed(2));
        setAssetSummary({
          unrealisedProfitLoss: unrealisedResults.filter(
            (res) => res.interval === "All"
          )[0].unrealisedProfitLoss,
          realisedProfitLoss: realisedProfitLossResults.filter(
            (res) => res.interval === "All"
          )[0].realisedProfitLoss,
        });
      }
    }
    fetchData();
  }, [assetToView, manualAsset, historicalData]);

  // // Handle change in interval
  function onChange(value: TInterval) {
    if (manualAsset) {
      lineChartData.sort(
        (a, b) => new Date(b.name).getTime() - new Date(a.name).getTime()
      );
    }
    prepareLineChartData(value, lineChartData, setDataToShow);

    if (unrealisedProfitLossArray && realisedProfitLossArray) {
      const unrealisedIntervalData = unrealisedProfitLossArray.filter(
        (res) => res.interval === value
      )[0];
      const realisedIntervalData = realisedProfitLossArray.filter(
        (res) => res.interval === value
      )[0];

      setCurrentValue(unrealisedIntervalData.currentValue);
      setInvestedValue(unrealisedIntervalData.compareValue);

      setCompareLabel(
        (
          +unrealisedIntervalData.currentValue -
          unrealisedIntervalData.valueAtInterval
        ).toFixed(2)
      );

      setAssetSummary({
        unrealisedProfitLoss: unrealisedIntervalData.unrealisedProfitLoss,
        realisedProfitLoss: realisedIntervalData.realisedProfitLoss,
      });
    }
  }

  // Get today's date
  const today = new Date();

  // Subtract one day
  const yesterday = new Date(new Date());
  yesterday.setDate(today.getDate() - 1);

  const formatter = new Intl.NumberFormat(
    numberSystem === "Indian" ? "en-IN" : "en-US",
    {
      style: "currency",
      currency: defaultCurrency || "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90vw] lg:min-w-[50vw]">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            {manualAsset !== undefined && (
              <TabsTrigger value="priceUpdate">Update Price</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="summary" className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <div>
                {assetToView && (
                  <span className="text-foreground pr-1">
                    {assetToView.symbol}
                  </span>
                )}
                {assetToView?.exchange !== undefined && (
                  <>({assetToView?.exchange})</>
                )}
                <div className="text-white text-3xl font-bold">
                  {assetToView?.name || manualAsset?.name}
                </div>
              </div>
              <div className="mb-2 text-white">
                <h3 className="text-3xl font-bold flex items-center">
                  {new Intl.NumberFormat(
                    numberSystem === "Indian" ? "en-IN" : "en-US",
                    {
                      style: "currency",
                      currency: defaultCurrency,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  ).format(+currentValue)}
                </h3>
                {assetToView && (
                  <div className="flex gap-1">
                    {assetSummary && (
                      <>
                        <p
                          className={cn(
                            "ml-1 text-sm",
                            +compareLabel > 0
                              ? "text-green-400"
                              : +compareLabel < 0
                              ? "text-red-400"
                              : "text-white"
                          )}
                        >
                          {(+compareLabel).toLocaleString("en-IN")}
                        </p>

                        <p
                          className={cn(
                            "text-sm rounded-sm px-0.5",
                            +compareLabel > 0
                              ? "text-green-400 bg-green-400/30"
                              : +compareLabel < 0
                              ? "text-red-400 bg-red-400/30"
                              : "text-white bg-white/30"
                          )}
                        >
                          {(
                            (+compareLabel * 100) /
                            (+currentValue - +compareLabel)
                          ).toFixed(2)}
                          %
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <ChangeInterval onChange={onChange} />
            </div>
            {dataToShow && (
              <AssetLineChart
                dataToShow={dataToShow}
                numberSystem={numberSystem}
                defaultCurrency={defaultCurrency}
              />
            )}
            {assetSummary && assetToView ? (
              <div className="mt-8 grid grid-cols-2 grid-rows-4 lg:grid-cols-4 lg:grid-rows-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Avg. buying price
                  </p>
                  {formatter.format(
                    +assetToView.buyPrice /
                      conversionRates[assetToView.buyCurrency.toLowerCase()]
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Previous close
                  </p>
                  {formatter.format(
                    +assetToView.prevClose /
                      conversionRates[assetToView.buyCurrency.toLowerCase()]
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Quantity</p>
                  {(+assetToView.quantity).toLocaleString(
                    numberSystem === "Indian" ? "en-IN" : "en-US"
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Buying currency
                  </p>
                  {assetToView.buyCurrency}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Invested value
                  </p>
                  {formatter.format(+investedValue)}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Current value</p>
                  {formatter.format(+currentValue)}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Unrealised profit/loss
                  </p>
                  <p
                    className={cn(
                      +assetSummary.unrealisedProfitLoss > 0
                        ? "text-green-400"
                        : +assetSummary.unrealisedProfitLoss < 0
                        ? "text-red-400"
                        : "text-white"
                    )}
                  >
                    {formatter.format(+assetSummary.unrealisedProfitLoss)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Realised profit/loss
                  </p>
                  <p
                    className={cn(
                      +assetSummary.realisedProfitLoss > 0
                        ? "text-green-400"
                        : +assetSummary.realisedProfitLoss < 0
                        ? "text-red-400"
                        : "text-white"
                    )}
                  >
                    {formatter.format(+assetSummary.realisedProfitLoss)}
                  </p>
                </div>
              </div>
            ) : (
              !manualAsset && (
                <div className="mt-12">
                  <LoadingSpinner />
                </div>
              )
            )}
          </TabsContent>
          <TabsContent value="transactions">
            {assetToView
              ? assetToView && (
                  <TransactionHistory
                    assetToView={assetToView}
                    defaultCurrency={defaultCurrency}
                  />
                )
              : manualAsset && (
                  <TransactionHistory
                    assetToView={manualAsset}
                    defaultCurrency={defaultCurrency}
                  />
                )}
          </TabsContent>
          {manualAsset !== undefined && (
            <TabsContent value="priceUpdate">
              <AssetPriceUpdates assetToView={manualAsset} />
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default ViewAsset;
