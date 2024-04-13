"use client";

import { cn, formatToLocaleString } from "@/lib/helper";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

const assetTypeMappings: Record<string, string> = {
  "Common Stock": "Stocks",
  "Digital Currency": "Crypto",
  "Mutual Fund": "Mutual Funds",
  // Add other mappings here
};

export type TDashboardTableData = {
  category: string;
  compareValue: number;
  currentValue: number;
};

export function getDashboardTableColumns(dashboardAmountVisibility: boolean) {
  const dashboardTableColumns: ColumnDef<TDashboardTableData>[] = [
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return (
          <div>
            {assetTypeMappings[row.original.category] || row.original.category}
          </div>
        );
      },
    },
    {
      accessorKey: "compareValue",
      header: ({ column }) => {
        return (
          <div
            className="flex justify-end hover:cursor-pointer hover:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Invested Value
            <ArrowUpDown className="ml-2 size-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-right">
            {dashboardAmountVisibility
              ? formatToLocaleString(row.original.compareValue.toFixed(2))
              : "* ".repeat(5)}
          </div>
        );
      },
      sortingFn: (rowA, rowB) =>
        rowA.original.compareValue - rowB.original.compareValue,
    },
    {
      accessorKey: "currentValue",
      header: ({ column }) => (
        <div
          className="flex justify-end hover:cursor-pointer hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Current Value
          <ArrowUpDown className="ml-2 size-4" />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-right">
            {dashboardAmountVisibility
              ? formatToLocaleString(row.original.currentValue.toFixed(2))
              : "* ".repeat(5)}
            <div
              className={cn(
                "flex items-center justify-end",
                row.original.currentValue >= row.original.compareValue
                  ? "text-green-400"
                  : "text-red-400"
              )}
            >
              (
              {dashboardAmountVisibility
                ? formatToLocaleString(
                    (
                      row.original.currentValue - row.original.compareValue
                    ).toFixed(2)
                  )
                : "* ".repeat(5)}
              {row.original.currentValue >= row.original.compareValue ? (
                <ArrowUp className="ml-2 size-4" />
              ) : (
                <ArrowDown className="ml-2 size-4" />
              )}
              )
            </div>
          </div>
        );
      },
      sortingFn: (rowA, rowB) =>
        rowA.original.currentValue - rowB.original.currentValue,
    },
    {
      id: "profitLossPercentage",
      header: ({ column }) => (
        <div
          className="flex justify-end hover:cursor-pointer hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Profit/Loss %
          <ArrowUpDown className="ml-2 size-4" />
        </div>
      ),
      cell: ({ row }) => {
        const { compareValue, currentValue } = row.original;
        const profitLoss = currentValue - compareValue;
        const profitLossPercentage = (profitLoss / compareValue) * 100;
        return (
          <div
            className={cn(
              "flex items-center justify-end",
              profitLoss > 0 ? "text-green-400" : "text-red-400"
            )}
          >
            ({profitLossPercentage.toFixed(2)}%
            {profitLoss > 0 ? (
              <ArrowUp className="ml-2 size-4" />
            ) : (
              <ArrowDown className="ml-2 size-4" />
            )}
            )
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const { compareValue: compareValueA, currentValue: currentValueA } =
          rowA.original;
        const { compareValue: compareValueB, currentValue: currentValueB } =
          rowB.original;
        const profitLossA = currentValueA - compareValueA;
        const profitLossB = currentValueB - compareValueB;
        const profitLossPercentageA = (profitLossA / compareValueA) * 100;
        const profitLossPercentageB = (profitLossB / compareValueB) * 100;
        return profitLossPercentageA - profitLossPercentageB;
      },
    },
  ];
  return dashboardTableColumns;
}
