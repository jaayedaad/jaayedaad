"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Asset } from "@/actions/getAssetsAction";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { useVisibility } from "@/contexts/visibility-context";

interface AssetTableProps {
  data: Asset[];
  view?: string; // "stocks" | "crypto" | "funds"
}

function AssetTable({ data, view }: AssetTableProps) {
  const { visible } = useVisibility();
  const filters: Record<string, (asset: Asset) => boolean> = {
    stocks: (asset) => asset.type === "EQUITY",
    crypto: (asset) => asset.type === "CRYPTOCURRENCY",
    funds: (asset) => asset.type === "MUTUALFUND",
  };

  let filteredAssets = data;
  let groupedAsset: {
    type: string;
    currentValue: number;
    compareValue: number;
  }[] = [];

  if (view) {
    filteredAssets = data.filter(filters[view]);
  } else {
    data.forEach((asset) => {
      if (asset.quantity !== "0") {
        const existingType = groupedAsset.find(
          (data) => data.type === asset.type
        );

        if (existingType) {
          existingType.currentValue += asset.currentValue;
          existingType.compareValue += asset.compareValue;
        } else {
          groupedAsset.push({
            type: asset.type,
            currentValue: asset.symbol
              ? asset.currentValue
              : parseFloat(asset.currentPrice),
            compareValue: asset.compareValue,
          });
        }
      }
    });

    filteredAssets = data;
  }

  return (
    filteredAssets.length > 0 && (
      <Table>
        <ScrollArea className={cn("w-full", view ? "h-[33vh]" : "h-[40vh]")}>
          <TableHeader className="bg-secondary sticky top-0">
            {view ? (
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right w-[128px]">Quantity</TableHead>
                <TableHead className="text-right w-[128px]">
                  Buying Price
                </TableHead>
                <TableHead className="text-right w-[128px]">
                  Buying Currency
                </TableHead>
                <TableHead className="text-right w-[136px]">
                  Previous Close
                </TableHead>
                <TableHead className="text-right w-[128px]">
                  Current Value (in INR)
                </TableHead>
              </TableRow>
            ) : (
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">
                  Invested Amount (in INR)
                </TableHead>
                <TableHead className="text-right">
                  Current Value (in INR)
                </TableHead>
                <TableHead className="text-right">
                  Net Profit/Loss (in INR)
                </TableHead>
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {view
              ? filteredAssets.map((asset, index) => {
                  return (
                    +asset.quantity > 0 && (
                      <TableRow key={index}>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell className="text-right">
                          {parseFloat(asset.quantity).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-right">
                          {parseFloat(asset.buyPrice).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {asset.buyCurrency}
                        </TableCell>
                        <TableCell className="text-right">
                          {asset?.prevClose}
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            asset.prevClose > asset.buyPrice
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          <div className="flex flex-col">
                            {visible
                              ? asset.currentValue.toLocaleString("en-IN")
                              : "* ".repeat(5)}
                            {asset.prevClose > asset.buyPrice ? (
                              <span className="flex items-center justify-end">
                                (
                                {(
                                  ((+asset.prevClose - +asset.buyPrice) * 100) /
                                  +asset.buyPrice
                                ).toFixed(2)}
                                %
                                <ArrowUpIcon className="h-4 w-4 ml-2" />)
                              </span>
                            ) : (
                              <span className="flex items-center justify-end">
                                (
                                {(
                                  ((+asset.buyPrice - +asset.prevClose) * 100) /
                                  +asset.buyPrice
                                ).toFixed(2)}
                                %
                                <ArrowDownIcon className="h-4 w-4 ml-2" />)
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  );
                })
              : groupedAsset.map((asset, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{asset.type}</TableCell>
                      <TableCell className="text-right">
                        {visible
                          ? parseFloat(
                              asset.compareValue.toFixed(2)
                            ).toLocaleString("en-IN")
                          : "* ".repeat(5)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right",
                          asset.currentValue > asset.compareValue
                            ? "text-green-400"
                            : "text-red-400"
                        )}
                      >
                        {visible
                          ? parseFloat(
                              asset.currentValue.toFixed(2)
                            ).toLocaleString("en-IN")
                          : "* ".repeat(5)}
                        {asset.currentValue > asset.compareValue ? (
                          <div className="flex justify-end items-center">
                            (
                            {(
                              ((asset.currentValue - asset.compareValue) *
                                100) /
                              asset.compareValue
                            ).toFixed(2)}
                            %
                            <ArrowUpIcon className="h-4 w-4 ml-2" />)
                          </div>
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 ml-2" />
                        )}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right",
                          asset.currentValue > asset.compareValue
                            ? "text-green-400"
                            : "text-red-400"
                        )}
                      >
                        {visible
                          ? (+Math.abs(
                              asset.currentValue - asset.compareValue
                            ).toFixed(2)).toLocaleString("en-IN")
                          : "* ".repeat(5)}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </ScrollArea>
      </Table>
    )
  );
}

export default AssetTable;
