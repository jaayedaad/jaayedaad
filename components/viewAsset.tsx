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

interface ViewAssetProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assetToView: {
    symbol: string;
    name: string;
    quantity: string;
    prevClose: string;
    currentValue: number;
    type: string;
    buyPrice: string;
    buyCurrency: string;
  };
  historicalData: any[];
}

function ViewAsset({
  open,
  setOpen,
  assetToView,
  historicalData,
}: ViewAssetProps) {
  const [dataToShow, setDataToShow] = useState<
    {
      name: string;
      amt: number;
    }[]
  >();

  const assetHistory = [
    historicalData.find((data) => data.assetSymbol === assetToView.symbol),
  ];
  const lineChartData = accumulateLineChartData(assetHistory);

  // Handle change in interval
  function onChange(value: Interval) {
    prepareLineChartData(value, lineChartData, setDataToShow);
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
          </TabsList>
          <TabsContent value="summary" className="mt-4">
            <p className="text-sm text-muted-foreground">
              {assetToView.symbol}
            </p>
            <div>
              <div className="flex justify-between">
                <h3
                  className={cn(
                    "text-3xl font-bold flex items-center",
                    assetToView.prevClose > assetToView.buyPrice
                      ? "text-green-400"
                      : "text-red-400"
                  )}
                >
                  <IndianRupee strokeWidth={3} className="mr-1" />
                  {assetToView.prevClose}
                </h3>
                <ChangeInterval onChange={onChange} />
              </div>
              <p className="text-sm text-muted-foreground">
                As on {yesterday.toLocaleDateString("en-GB")}
              </p>
            </div>
            {dataToShow && <AssetLineChart dataToShow={dataToShow} />}
          </TabsContent>
          <TabsContent value="transactions">
            <TransactionHistory assetName={assetToView.name} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default ViewAsset;
