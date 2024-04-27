import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent } from "./ui/dialog";
import { cn } from "@/lib/helper";
import ChangeInterval from "./changeInterval";
import AssetLineChart from "./assetLineChart";
import TransactionHistory from "./transactionHistory";
import {
  TAsset,
  TInterval,
  TLineChartData,
  TProfitLoss,
  TUnrealisedProfitLoss,
} from "@/types/types";
import AssetPriceUpdates from "./assetPriceUpdates";
import LoadingSpinner from "./ui/loading-spinner";

interface ViewAssetProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assetToView?: TAsset;
  manualAsset?: TAsset;
  unrealisedResults: TUnrealisedProfitLoss[];
  realisedResults: TProfitLoss[];
  conversionRates: {
    [currency: string]: number;
  };
  numberSystem: string;
  defaultCurrency: string;
  chartData: TLineChartData;
}

function ViewAsset({
  open,
  setOpen,
  assetToView,
  manualAsset,
  conversionRates,
  numberSystem,
  unrealisedResults,
  realisedResults,
  defaultCurrency,
  chartData,
}: ViewAssetProps) {
  const [dataToShow, setDataToShow] = useState<
    {
      name: string;
      amt: number;
      timestamp: number;
    }[]
  >(chartData.filter((data) => data.interval === "All")[0].data);
  const [currentValue, setCurrentValue] = useState(
    unrealisedResults.filter((res) => res.interval === "All")[0].currentValue
  );
  const [investedValue, setInvestedValue] = useState(
    unrealisedResults.filter((res) => res.interval === "All")[0].compareValue
  );
  const [compareLabel, setCompareLabel] = useState(
    (
      +currentValue -
      unrealisedResults.filter((res) => res.interval === "All")[0]
        .valueAtInterval
    ).toFixed(2)
  );
  const [assetSummary, setAssetSummary] = useState<{
    unrealisedProfitLoss: string;
    realisedProfitLoss: string;
  }>({
    unrealisedProfitLoss: unrealisedResults.filter(
      (res) => res.interval === "All"
    )[0].unrealisedProfitLoss,
    realisedProfitLoss: realisedResults.filter(
      (res) => res.interval === "All"
    )[0].realisedProfitLoss,
  });
  // // Handle change in interval
  function onChange(value: TInterval) {
    setDataToShow(chartData.filter((data) => data.interval === value)[0].data);

    if (unrealisedResults && realisedResults) {
      const unrealisedIntervalData = unrealisedResults.filter(
        (res) => res.interval === value
      )[0];
      const realisedIntervalData = realisedResults.filter(
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
      <DialogContent className="p-4 lg:p-6 w-[90vw] max-h-[95vh] overflow-auto lg:min-w-[50vw]">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            {manualAsset !== undefined && (
              <TabsTrigger value="priceUpdate">Update Price</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="summary" className="mt-4">
            <div className="lg:flex justify-between text-sm text-muted-foreground">
              <div>
                {assetToView && (
                  <span className="text-foreground pr-1">
                    {assetToView.symbol}
                  </span>
                )}
                {assetToView?.exchange !== undefined && (
                  <>({assetToView?.exchange})</>
                )}
                <div className="text-white text-lg lg:text-3xl lg:font-bold">
                  {assetToView?.name || manualAsset?.name}
                </div>
              </div>
              <div className="mt-2 lg:mt-0 mb-2 text-white">
                <h3 className="text-lg lg:text-3xl lg:font-bold flex items-center">
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
              <div className="mt-8 grid grid-cols-2 grid-rows-4 gap-y-2 lg:gap-y-0 lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Avg. buying price
                  </p>
                  {formatter.format(
                    +assetToView.buyPrice /
                      conversionRates[assetToView.buyCurrency.toLowerCase()]
                  )}
                </div>
                <div className="text-right lg:text-left">
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
                <div className="text-right lg:text-left">
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
                <div className="text-right lg:text-left">
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
                <div className="text-right lg:text-left">
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
