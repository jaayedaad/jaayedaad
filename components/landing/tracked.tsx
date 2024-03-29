import React from "react";
import { Bitcoin, CandlestickChart, Landmark } from "lucide-react";

function Tracked() {
  return (
    <div className="lg:px-4 flex gap-2 items-center text-primary-foreground mb-6">
      <div className="flex">
        <CandlestickChart className="bg-primary-foreground text-primary rounded-full border-2 border-primary h-10 w-10 p-1" />
        <Bitcoin className="bg-primary-foreground text-primary rounded-full border-2 border-primary h-10 w-10 p-1 -ml-4" />
        <Landmark className="bg-primary-foreground text-primary rounded-full border-2 border-primary h-10 w-10 p-1 -ml-4" />
      </div>
      <div className="h-10 px-4 py-2 bg-primary-foreground text-primary rounded-full">
        4.5 Million $
      </div>
      <h3 className="text-xl font-semibold">Tracked</h3>
    </div>
  );
}

export default Tracked;
