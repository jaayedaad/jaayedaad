import React from "react";
import { Bitcoin, CandlestickChart, Landmark } from "lucide-react";
import { getTrackedAmount } from "@/actions/getTrackedAmountAction";

function formatNumber(num: number) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + " Billion";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + " Million";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + " Thousand";
  }
  return num.toString();
}

async function Tracked() {
  const trackedAmount = await getTrackedAmount();

  return (
    <div className="lg:px-4 flex gap-2 items-center text-primary-foreground mb-6">
      <div className="flex">
        <CandlestickChart className="bg-primary-foreground text-primary rounded-full border-2 border-primary h-10 w-10 p-1" />
        <Bitcoin className="bg-primary-foreground text-primary rounded-full border-2 border-primary h-10 w-10 p-1 -ml-4" />
        <Landmark className="bg-primary-foreground text-primary rounded-full border-2 border-primary h-10 w-10 p-1 -ml-4" />
      </div>
      <div className="h-10 px-4 py-2 bg-primary-foreground text-primary rounded-full">
        {formatNumber(trackedAmount)} $
      </div>
      <h3 className="text-xl font-semibold">Tracked</h3>
    </div>
  );
}

export default Tracked;
