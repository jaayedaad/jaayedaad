import { cn } from "@/lib/helper";
import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

type DashboardTableCardProps = {
  category: string;
  investedValue: number;
  currentValue: number;
  profitLossPercentage: number;
};

function DashboardTableCard({
  category,
  investedValue,
  currentValue,
  profitLossPercentage,
}: DashboardTableCardProps) {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between">
        <h3 className="text-lg">{category}</h3>
        <p
          className={cn(
            "flex items-center text-sm",
            profitLossPercentage > 0
              ? "text-green-400"
              : profitLossPercentage < 0
              ? "text-red-400"
              : "text-white"
          )}
        >
          {profitLossPercentage.toFixed(2)}%
          {profitLossPercentage >= 0 ? (
            <ArrowUp className="size-4 ml-1" />
          ) : (
            <ArrowDown className="size-4 ml-1" />
          )}
        </p>
      </div>
      <div className="mt-2">
        <div className="flex justify-between">
          <div>
            <h3 className="text-muted-foreground">Invested Value</h3>
            <p>{investedValue.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <h3 className="text-muted-foreground">Current Value</h3>
            <p
              className={cn(
                profitLossPercentage > 0
                  ? "text-green-400"
                  : profitLossPercentage < 0
                  ? "text-red-400"
                  : "text-white"
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

export default DashboardTableCard;
