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
  const [compareLabel, setCompareLabel] = useState("");
  const [assetSummary, setAssetSummary] = useState<{
    compareValue: string;
    currentValue: string;
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
      if (assetToView) {
        const unrealisedResults = getUnrealisedProfitLossArray(historicalData, [
          assetToView,
        ]);
        setUnrealisedProfitLossArray(unrealisedResults);
        const realisedProfitLossResults = calculateRealisedProfitLoss(
          [assetToView],
          conversionRates
        );
        setRealisedProfitLossArray(realisedProfitLossResults);
        setAssetSummary({
          compareValue: (
            assetToView.compareValue /
            conversionRates[assetToView.buyCurrency.toLowerCase()]
          ).toFixed(2),
          currentValue: (
            assetToView.currentValue /
            conversionRates[assetToView.buyCurrency.toLowerCase()]
          ).toFixed(2),
          unrealisedProfitLoss: calculateUnrealisedProfitLoss([
            assetToView,
          ]).toString(),
          realisedProfitLoss: realisedProfitLossResults.filter(
            (res) => res.interval === "All"
          )[0].realisedProfitLoss,
        });
      }
    }
    fetchData();
  }, [assetToView, historicalData]);

  // // Handle change in interval
  function onChange(value: TInterval) {
    if (manualAsset) {
      lineChartData.sort(
        (a, b) => new Date(b.name).getTime() - new Date(a.name).getTime()
      );
    }
    prepareLineChartData(value, lineChartData, setDataToShow);
    setCurrentValue(
      assetToView
        ? (
            +assetHistory[0].values[assetHistory[0].values.length - 1].close /
            conversionRates[assetToView.buyCurrency.toLowerCase()]
          ).toFixed(2)
        : (
            +manualAsset?.currentPrice! /
            conversionRates[manualAsset!.buyCurrency.toLowerCase()]
          ).toFixed(2)
    );

    switch (value) {
      case "1d":
        setCompareLabel(
          assetHistory[0].values.length > 0
            ? assetToView?.symbol !== null
              ? assetHistory[0].values[1].close
              : assetHistory[0].values[assetHistory[0].values.length - 2].value
            : assetToView?.symbol !== null
            ? assetHistory[0].values[0].close
            : assetHistory[0].values[0].value
        );
        unrealisedProfitLossArray &&
          realisedProfitLossArray &&
          setAssetSummary({
            compareValue: unrealisedProfitLossArray.filter(
              (res) => res.interval === "1d"
            )[0].compareValue,
            currentValue: unrealisedProfitLossArray.filter(
              (res) => res.interval === "1d"
            )[0].currentValue,
            unrealisedProfitLoss: unrealisedProfitLossArray.filter(
              (res) => res.interval === "1d"
            )[0].unrealisedProfitLoss,
            realisedProfitLoss: realisedProfitLossArray.filter(
              (res) => res.interval === "1d"
            )[0].realisedProfitLoss,
          });
        break;
      case "1w":
        setCompareLabel(
          assetHistory[0].values.length > 6
            ? assetToView?.symbol !== null
              ? assetHistory[0].values[assetHistory[0].values.length - 7].close
              : assetHistory[0].values[assetHistory[0].values.length - 7].value
            : assetToView?.symbol !== null
            ? assetHistory[0].values[0].close
            : assetHistory[0].values[0].value
        );
        unrealisedProfitLossArray &&
          realisedProfitLossArray &&
          setAssetSummary({
            compareValue: unrealisedProfitLossArray.filter(
              (res) => res.interval === "1w"
            )[0].compareValue,
            currentValue: unrealisedProfitLossArray.filter(
              (res) => res.interval === "1w"
            )[0].currentValue,
            unrealisedProfitLoss: unrealisedProfitLossArray.filter(
              (res) => res.interval === "1w"
            )[0].unrealisedProfitLoss,
            realisedProfitLoss: realisedProfitLossArray.filter(
              (res) => res.interval === "1w"
            )[0].realisedProfitLoss,
          });
        break;
      case "1m":
        setCompareLabel(
          assetHistory[0].values.length > 29
            ? assetToView?.symbol !== null
              ? assetHistory[0].values[assetHistory[0].values.length - 30].close
              : assetHistory[0].values[assetHistory[0].values.length - 30].value
            : assetToView?.symbol !== null
            ? assetHistory[0].values[0].close
            : assetHistory[0].values[0].value
        );
        unrealisedProfitLossArray &&
          realisedProfitLossArray &&
          setAssetSummary({
            compareValue: unrealisedProfitLossArray.filter(
              (res) => res.interval === "1m"
            )[0].compareValue,
            currentValue: unrealisedProfitLossArray.filter(
              (res) => res.interval === "1m"
            )[0].currentValue,
            unrealisedProfitLoss: unrealisedProfitLossArray.filter(
              (res) => res.interval === "1m"
            )[0].unrealisedProfitLoss,
            realisedProfitLoss: realisedProfitLossArray.filter(
              (res) => res.interval === "1m"
            )[0].realisedProfitLoss,
          });
        break;
      case "1y":
        setCompareLabel(
          assetHistory[0].values.length > 365
            ? assetToView?.symbol !== null
              ? assetHistory[0].values[assetHistory[0].values.length - 365]
                  .close
              : assetHistory[0].values[assetHistory[0].values.length - 365]
                  .value
            : assetToView?.symbol !== null
            ? assetHistory[0].values[0].close
            : assetHistory[0].values[0].value
        );
        unrealisedProfitLossArray &&
          realisedProfitLossArray &&
          setAssetSummary({
            compareValue: unrealisedProfitLossArray.filter(
              (res) => res.interval === "1y"
            )[0].compareValue,
            currentValue: unrealisedProfitLossArray.filter(
              (res) => res.interval === "1y"
            )[0].currentValue,
            unrealisedProfitLoss: unrealisedProfitLossArray.filter(
              (res) => res.interval === "1y"
            )[0].unrealisedProfitLoss,
            realisedProfitLoss: realisedProfitLossArray.filter(
              (res) => res.interval === "1y"
            )[0].realisedProfitLoss,
          });
        break;
      case "All":
        setCompareLabel(
          assetToView?.symbol !== null
            ? assetHistory[0].values[0].close
            : assetHistory[0].values[0].value
        );
        assetToView &&
          realisedProfitLossArray &&
          setAssetSummary({
            compareValue: (
              assetToView.compareValue /
              conversionRates[assetToView.buyCurrency.toLowerCase()]
            ).toFixed(2),
            currentValue: (
              assetToView.currentValue /
              conversionRates[assetToView.buyCurrency.toLowerCase()]
            ).toFixed(2),
            unrealisedProfitLoss: calculateUnrealisedProfitLoss([
              assetToView,
            ]).toString(),
            realisedProfitLoss: realisedProfitLossArray.filter(
              (res) => res.interval === "All"
            )[0].realisedProfitLoss,
          });
        break;
      default:
        throw new Error("Invalid interval value");
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
                    <p
                      className={cn(
                        "ml-1 text-sm",
                        parseFloat(currentValue) > parseFloat(compareLabel)
                          ? "text-green-400"
                          : parseFloat(currentValue) < parseFloat(compareLabel)
                          ? "text-red-400"
                          : "text-white"
                      )}
                    >
                      {currentValue > compareLabel && "+"}
                      {(
                        parseFloat(currentValue) - parseFloat(compareLabel)
                      ).toLocaleString("en-IN")}
                    </p>
                    <p
                      className={cn(
                        "text-sm rounded-sm px-0.5",
                        parseFloat(currentValue) > parseFloat(compareLabel)
                          ? "text-green-400 bg-green-400/30"
                          : parseFloat(currentValue) < parseFloat(compareLabel)
                          ? "text-red-400 bg-red-400/30"
                          : "text-white bg-white/30"
                      )}
                    >
                      {currentValue > compareLabel && "+"}
                      {assetToView
                        ? (
                            ((+parseFloat(currentValue) -
                              +parseFloat(compareLabel)) *
                              100) /
                            +compareLabel
                          ).toFixed(2)
                        : manualAsset &&
                          (
                            ((manualAsset.currentValue - +compareLabel) * 100) /
                            +compareLabel
                          ).toFixed(2)}
                      %
                    </p>
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
                  {formatter.format(+assetSummary.compareValue)}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Current value</p>
                  {formatter.format(+assetSummary.currentValue)}
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
