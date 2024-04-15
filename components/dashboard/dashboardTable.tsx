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
import { TDashboardTableData } from "./columns";
import { useRouter } from "next/navigation";
import DashboardTableCard from "../mobile/dashboardTableCard";
import Link from "next/link";

const assetTypeMappings: Record<string, string> = {
  "Common Stock": "Stocks",
  "Digital Currency": "Crypto",
  "Mutual Fund": "Mutual Funds",
  // Add other mappings here
};

interface DataTableProps<TValue> {
  columns: ColumnDef<TDashboardTableData, TValue>[];
  data: TDashboardTableData[];
}

export function DashboardTable<TValue>({
  columns,
  data,
}: DataTableProps<TValue>) {
  const router = useRouter();
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
                  className="hover:cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/dashboard/${(
                        assetTypeMappings[row.original.category] ||
                        row.original.category
                      ).toLowerCase()}`
                    );
                  }}
                  key={row.id}
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
            const { valueAtInterval, currentValue } = row.original;
            const profitLoss = currentValue - valueAtInterval;
            const profitLossPercentage = (profitLoss / valueAtInterval) * 100;
            return (
              <Link
                href={`/dashboard/${(
                  assetTypeMappings[row.original.category] ||
                  row.original.category
                ).toLowerCase()}`}
                key={row.id}
              >
                <DashboardTableCard
                  category={row.original.category}
                  currentValue={row.original.currentValue}
                  investedValue={row.original.compareValue}
                  profitLossPercentage={profitLossPercentage}
                />
              </Link>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}
