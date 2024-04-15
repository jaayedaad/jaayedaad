import { cn } from "@/lib/helper";
import { ArrowUp, ArrowDown } from "lucide-react";
import React from "react";

type AssetsTableCardProps = {
  name: string;
  exchange: string;
  quantity: number;
  investedValue: number;
  currentValue: number;
  profitLossPercentage: number;
};

function AssetsTableCard({
  name,
  exchange,
  quantity,
  investedValue,
  currentValue,
  profitLossPercentage,
}: AssetsTableCardProps) {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between">
        <h3>
          {name} ({exchange})
        </h3>
      </div>
      <div className="mt-2">
        <div className="grid grid-cols-2 gap-y-1">
          <div>
            <h3 className="text-muted-foreground">Quantity</h3>
            <p>{quantity.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <h3 className="text-muted-foreground">Profit/Loss %</h3>
            <p
              className={cn(
                "flex items-center text-sm justify-end",
                profitLossPercentage > 0 ? "text-green-400" : "text-red-400"
              )}
            >
              {profitLossPercentage.toFixed(2)} %
              {profitLossPercentage >= 0 ? (
                <ArrowUp className="ml-2 size-4" />
              ) : (
                <ArrowDown className="ml-2 size-4" />
              )}
            </p>
          </div>
          <div>
            <h3 className="text-muted-foreground">Invested Value</h3>
            <p>{investedValue.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <h3 className="text-muted-foreground">Current Value</h3>
            <p
              className={cn(
                currentValue > 0 ? "text-green-400" : "text-red-400"
              )}
            >
              {currentValue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetsTableCard;
