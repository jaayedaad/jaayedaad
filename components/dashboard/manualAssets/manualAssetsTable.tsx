"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { TAsset, TConversionRates } from "@/types/types";
import ManualAssetsTableCard from "@/components/mobile/manualAssetsTableCard";

interface DataTableProps<TValue> {
  columns: ColumnDef<TAsset, TValue>[];
  data: TAsset[];
  conversionRates: TConversionRates;
  setManualAsset: React.Dispatch<React.SetStateAction<TAsset | undefined>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ManualAssetDataTable<TValue>({
  columns,
  data,
  conversionRates,
  setManualAsset,
  setOpen,
}: DataTableProps<TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className="hidden lg:block rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setManualAsset(row.original);
                    setOpen(true);
                  }}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="lg:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const {
              valueAtInterval,
              currentValue: currValue,
              buyCurrency,
            } = row.original;
            const currencyConversion =
              1 / conversionRates[buyCurrency.toLowerCase()];
            const currentValue = currValue * currencyConversion;
            const profitLoss = currentValue - valueAtInterval;
            const profitLossPercentage = (profitLoss / valueAtInterval) * 100;
            return (
              <div
                key={row.id}
                onClick={() => {
                  setManualAsset(row.original);
                  setOpen(true);
                }}
              >
                <ManualAssetsTableCard
                  name={row.original.name}
                  quantity={+row.original.quantity}
                  investedValue={row.original.compareValue}
                  currentValue={currentValue}
                  profitLossPercentage={profitLossPercentage}
                />
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}
