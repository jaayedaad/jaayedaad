import { cn, formatToLocaleString } from "@/lib/helper";
import { TAsset, TConversionRates } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export function getAssetTableColumns(
  dashboardAmountVisibility: boolean,
  conversionRates: TConversionRates
) {
  const assetTableColumns: ColumnDef<TAsset>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "exchange",
      header: ({ column }) => (
        <div
          className="flex justify-end hover:cursor-pointer hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Exchange
          <ArrowUpDown className="ml-2 size-4" />
        </div>
      ),
      cell: ({ row }) => {
        return <div className="text-right">{row.original.exchange}</div>;
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <div
          className="flex justify-end hover:cursor-pointer hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 size-4" />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-right">
            {dashboardAmountVisibility
              ? formatToLocaleString(row.original.quantity)
              : "* ".repeat(5)}
          </div>
        );
      },
      sortingFn: (rowA, rowB) =>
        +rowA.original.quantity - +rowB.original.quantity,
    },
    {
      accessorKey: "buyPrice",
      header: ({ column }) => (
        <div
          className="flex justify-end hover:cursor-pointer hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Avg. Buying Price
          <ArrowUpDown className="ml-2 size-4" />
        </div>
      ),
      cell: ({ row }) => {
        const buyPrice = +row.original.buyPrice;
        const buyCurrency = row.original.buyCurrency.toLowerCase();
        const conversionRate = conversionRates[buyCurrency];

        const avgBuyPrice = (buyPrice / conversionRate).toFixed(2);
        return <div className="text-right">{avgBuyPrice}</div>;
      },
      sortingFn: (rowA, rowB) =>
        +rowA.original.buyPrice - +rowB.original.buyPrice,
    },

    {
      accessorKey: "prevClose",
      header: ({ column }) => (
        <div
          className="flex justify-end hover:cursor-pointer hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prev. Close
          <ArrowUpDown className="ml-2 size-4" />
        </div>
      ),
      cell: ({ row }) => {
        const prevClose = +row.original.prevClose;
        const buyCurrency = row.original.buyCurrency.toLowerCase();
        const conversionRate = conversionRates[buyCurrency];
        const previousClose = (prevClose / conversionRate).toFixed(2);
        return (
          <div className="text-right">
            {formatToLocaleString(previousClose)}
          </div>
        );
      },
      sortingFn: (rowA, rowB) =>
        +rowA.original.prevClose - +rowB.original.prevClose,
    },
    {
      accessorKey: "compareValue",
      header: ({ column }) => (
        <div
          className="flex justify-end hover:cursor-pointer hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invested Value
          <ArrowUpDown className="ml-2 size-4" />
        </div>
      ),
      cell: ({ row }) => {
        const compareValue = row.original.compareValue;
        const buyCurrency = row.original.buyCurrency.toLowerCase();
        const conversionRate = conversionRates[buyCurrency];
        const investedValue = (compareValue / conversionRate).toFixed(2);
        return (
          <div className="text-right">
            {dashboardAmountVisibility
              ? formatToLocaleString(investedValue)
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
        const currValue = row.original.currentValue;
        const buyCurrency = row.original.buyCurrency.toLowerCase();
        const conversionRate = conversionRates[buyCurrency];
        const currentValue = (currValue / conversionRate).toFixed(2);
        const profitLoss = currValue - row.original.compareValue;
        const percentageChange = (profitLoss / row.original.compareValue) * 100;
        return (
          <div
            className={cn(
              "text-right",
              profitLoss >= 0 ? "text-green-400" : "text-red-400"
            )}
          >
            {dashboardAmountVisibility
              ? formatToLocaleString(currentValue)
              : "* ".repeat(5)}
            <div className="flex items-center justify-end">
              ({percentageChange.toFixed(2)}%{" "}
              {profitLoss >= 0 ? (
                <ArrowUp className="size-4 ml-2" />
              ) : (
                <ArrowDown className="size-4 ml-2" />
              )}
              )
            </div>
          </div>
        );
      },
      sortingFn: (rowA, rowB) =>
        rowA.original.currentValue - rowB.original.currentValue,
    },
  ];

  return assetTableColumns;
}
