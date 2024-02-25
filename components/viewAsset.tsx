import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent } from "./ui/dialog";
import { IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { accumulateLineChartData } from "@/helper/lineChartDataAccumulator";
import ChangeInterval, { Interval } from "./changeInterval";
import AssetLineChart from "./assetLineChart";
import { prepareLineChartData } from "@/helper/prepareLineChartData";
import TransactionHistory from "./transactionHistory";
import { prepareHistoricalDataForManualCategory } from "@/helper/manualAssetsHistoryMaker";
import { Asset } from "@/actions/getAssetsAction";
import AssetPriceUpdates from "./assetPriceUpdates";

interface ViewAssetProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assetToView?: {
    symbol: string;
    exchange: string;
    name: string;
    quantity: string;
    prevClose: string;
    currentValue: number;
    type: string;
    buyPrice: string;
    buyCurrency: string;
  };
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
        ? assetHistory[0].prices[0].close
        : assetHistory[0].prices[assetHistory[0].prices.length - 1].value
    );
    switch (value) {
      case "1d":
        setCompareLabel(
          assetToView?.symbol !== ""
            ? assetHistory[0].prices[1].close
            : assetHistory[0].prices[assetHistory[0].prices.length - 2].value
        );
        break;
      case "1w":
        setCompareLabel(
          assetToView?.symbol !== ""
            ? assetHistory[0].prices[6].close
            : assetHistory[0].prices.length > 7
            ? assetHistory[0].prices[assetHistory[0].prices.length - 8].value
            : assetHistory[0].prices[0].value
        );
        break;
      case "1m":
        setCompareLabel(
          assetToView?.symbol !== ""
            ? assetHistory[0].prices[29].close
            : assetHistory[0].prices.length > 30
            ? assetHistory[0].prices[assetHistory[0].prices.length - 31].value
            : assetHistory[0].prices[0].value
        );
        break;
      case "1y":
        setCompareLabel(
          assetToView?.symbol !== ""
            ? assetHistory[0].prices[assetHistory[0].prices.length - 1].close
            : assetHistory[0].prices.length > 365
            ? assetHistory[0].prices[assetHistory[0].prices.length - 366].value
            : assetHistory[0].prices[0].value
        );
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
      <DialogContent className="h-[47vh] min-w-[50vw]">
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
