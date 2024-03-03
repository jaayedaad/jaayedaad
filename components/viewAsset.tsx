import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent } from "./ui/dialog";
import { IndianRupee, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { accumulateLineChartData } from "@/helper/lineChartDataAccumulator";
import ChangeInterval, { Interval } from "./changeInterval";
import AssetLineChart from "./assetLineChart";
import { prepareLineChartData } from "@/helper/prepareLineChartData";
import TransactionHistory from "./transactionHistory";
import { prepareHistoricalDataForManualCategory } from "@/helper/manualAssetsHistoryMaker";
import { Asset } from "@/actions/getAssetsAction";
import AssetPriceUpdates from "./assetPriceUpdates";
import { getConversionRate } from "@/actions/getConversionRateAction";
import {
  calculateUnrealisedProfitLoss,
  getUnrealisedProfitLossArray,
} from "@/helper/unrealisedValueCalculator";
import {
  ProfitLoss,
  calculateRealisedProfitLoss,
} from "@/helper/realisedValueCalculator";
import LoadingSpinner from "./ui/loading-spinner";

interface ViewAssetProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assetToView?: Asset;
  manualAsset?: Asset;
  historicalData: any[];
}

function ViewAsset({
  open,
  setOpen,
  assetToView,
  manualAsset,
  historicalData,
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
    useState<ProfitLoss[]>();
  const [unrealisedProfitLossArray, setUnrealisedProfitLossArray] = useState<
    {
      type: string;
      symbol: string;
      compareValue: string;
      currentValue: string;
      prevClose: string;
      interval: string;
      unrealisedProfitLoss: string;
    }[]
  >();

  const assetHistory: any[] = [];
  if (assetToView?.symbol !== "") {
    assetHistory.push(
      historicalData.find((data) => data.assetSymbol === assetToView?.symbol)
    );
  } else if (manualAsset) {
    const manualHistory = prepareHistoricalDataForManualCategory([manualAsset]);
    assetHistory.splice(0, assetHistory.length, ...manualHistory);
  }
  const lineChartData = accumulateLineChartData(assetHistory);

  useEffect(() => {
    async function fetchData() {
      if (assetToView) {
        const conversionRate = await getConversionRate();
        const unrealisedResults = getUnrealisedProfitLossArray(
          historicalData,
          [assetToView],
          conversionRate
        );
        setUnrealisedProfitLossArray(unrealisedResults);
        const realisedProfitLossResults = calculateRealisedProfitLoss(
          [assetToView],
          conversionRate
        );
        setRealisedProfitLossArray(realisedProfitLossResults);
        setAssetSummary({
          compareValue: assetToView.compareValue.toFixed(2),
          currentValue: assetToView.currentValue.toFixed(2),
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
  function onChange(value: Interval) {
    if (manualAsset) {
      lineChartData.sort(
        (a, b) => new Date(b.name).getTime() - new Date(a.name).getTime()
      );
    }
    prepareLineChartData(value, lineChartData, setDataToShow);
    setCurrentValue(
      assetToView?.symbol !== ""
        ? assetHistory[0].values[0].close
        : assetHistory[0].values[0].value
    );
    switch (value) {
      case "1d":
        setCompareLabel(
          assetHistory[0].values.length > 0
            ? assetToView?.symbol !== ""
              ? assetHistory[0].values[1].close
              : assetHistory[0].values[assetHistory[0].values.length - 2].value
            : assetToView?.symbol !== ""
            ? assetHistory[0].values[assetHistory[0].values.length - 1].close
            : assetHistory[0].values[assetHistory[0].values.length - 1].value
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
            ? assetToView?.symbol !== ""
              ? assetHistory[0].values[7].close
              : assetHistory[0].values[assetHistory[0].values.length - 8].value
            : assetToView?.symbol !== ""
            ? assetHistory[0].values[assetHistory[0].values.length - 1].close
            : assetHistory[0].values[assetHistory[0].values.length - 1].value
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
            ? assetToView?.symbol !== ""
              ? assetHistory[0].values[30].close
              : assetHistory[0].values[assetHistory[0].values.length - 30].value
            : assetToView?.symbol !== ""
            ? assetHistory[0].values[assetHistory[0].values.length - 1].close
            : assetHistory[0].values[assetHistory[0].values.length - 1].value
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
          assetHistory[0].values.length > 364
            ? assetToView?.symbol !== ""
              ? assetHistory[0].values[365].close
              : assetHistory[0].values[assetHistory[0].values.length - 366]
                  .value
            : assetToView?.symbol !== ""
            ? assetHistory[0].values[assetHistory[0].values.length - 1].close
            : assetHistory[0].values[assetHistory[0].values.length - 1].value
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
          assetToView?.symbol !== ""
            ? assetHistory[0].values[assetHistory[0].values.length - 1].close
            : assetHistory[0].values[assetHistory[0].values.length - 1].value
        );
        assetToView &&
          realisedProfitLossArray &&
          setAssetSummary({
            compareValue: assetToView.compareValue.toFixed(2),
            currentValue: assetToView.currentValue.toFixed(2),
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-[516px] min-w-[50vw]">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            {manualAsset !== undefined && (
              <TabsTrigger value="priceUpdate">Update Price</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="summary" className="mt-4">
            <div className="text-sm text-muted-foreground">
              <span className="text-foreground pr-1">
                {assetToView?.symbol !== ""
                  ? assetToView?.symbol
                  : manualAsset?.name}
              </span>
              {assetToView?.exchange !== "" && <>({assetToView?.exchange})</>}
            </div>
            <div>
              <div className="flex justify-between">
                <div>
                  <h3 className="text-3xl font-bold flex items-center">
                    <IndianRupee strokeWidth={3} />
                    {parseFloat(
                      parseFloat(currentValue).toFixed(2)
                    ).toLocaleString("en-IN")}
                  </h3>
                  <div className="flex gap-1">
                    <p
                      className={cn(
                        "ml-1 text-sm",
                        compareLabel < currentValue
                          ? "text-green-400"
                          : "text-red-400"
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
                        currentValue > compareLabel
                          ? "text-green-400 bg-green-400/30"
                          : "text-red-400 bg-red-400/30"
                      )}
                    >
                      {currentValue > compareLabel && "+"}
                      {(
                        ((+parseFloat(currentValue) -
                          +parseFloat(compareLabel)) *
                          100) /
                        +compareLabel
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                </div>
                <ChangeInterval onChange={onChange} />
              </div>
            </div>
            {dataToShow && <AssetLineChart dataToShow={dataToShow} />}
            {assetSummary && assetToView ? (
              <div className="mt-8 grid grid-cols-4 grid-rows-2 gap-4">
                <div className="">
                  <p className="text-muted-foreground text-sm">
                    Avg. buying price
                  </p>
                  {(+assetToView.buyPrice).toLocaleString("en-IN")}
                </div>
                <div className="">
                  <p className="text-muted-foreground text-sm">Quantity</p>
                  {(+assetToView.quantity).toLocaleString("en-IN")}
                </div>
                <div className="">
                  <p className="text-muted-foreground text-sm">
                    Previous close
                  </p>
                  {(+assetToView.prevClose).toLocaleString("en-IN")}
                </div>
                <div className="">
                  <p className="text-muted-foreground text-sm">
                    Invested value
                  </p>
                  {(+assetSummary.compareValue).toLocaleString("en-IN")}
                </div>
                <div className="">
                  <p className="text-muted-foreground text-sm">Current value</p>
                  {assetSummary.currentValue}
                </div>
                <div className="">
                  <p className="text-muted-foreground text-sm">
                    Realised profit/loss
                  </p>
                  {assetSummary.realisedProfitLoss}
                </div>
                <div className="">
                  <p className="text-muted-foreground text-sm">
                    Unrealised profit/loss
                  </p>
                  {assetSummary.unrealisedProfitLoss}
                </div>
              </div>
            ) : (
              <div className="mt-12">
                <LoadingSpinner />
              </div>
            )}
          </TabsContent>
          <TabsContent value="transactions">
            {assetToView?.symbol !== ""
              ? assetToView && (
                  <TransactionHistory assetName={assetToView.name} />
                )
              : manualAsset && (
                  <TransactionHistory assetName={manualAsset.name} />
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
