"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";
import { Asset } from "@/actions/getAssetsAction";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { useVisibility } from "@/contexts/visibility-context";
import { useEffect, useState } from "react";
import { useData } from "@/contexts/data-context";
import ViewAsset from "./viewAsset";
import { Button } from "./ui/button";

interface AssetTableProps {
  data: Asset[];
  view?: string; // "stocks" | "crypto" | "funds" | "property"
}

function AssetTable({ data, view }: AssetTableProps) {
  const { visible } = useVisibility();
  const { historicalData } = useData();
  const [open, setOpen] = useState(false);
  const [assetToView, setAssetToView] = useState({
    symbol: "",
    exchange: "",
    name: "",
    quantity: "",
    prevClose: "",
    currentValue: 0,
    type: "",
    buyPrice: "",
    buyCurrency: "",
  });
  const [groupedAsset, setGroupedAsset] = useState<
    {
      type: string;
      currentValue: number;
      compareValue: number;
    }[]
  >();
  const [manualAsset, setManualAsset] = useState<Asset>();
  const [filteredAsset, setFilteredAsset] = useState<Asset[]>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filters: Record<string, (asset: Asset) => boolean> = {
    stocks: (asset) => asset.type === "EQUITY",
    crypto: (asset) => asset.type === "CRYPTOCURRENCY",
    funds: (asset) => asset.type === "MUTUALFUND",
    property: (asset) => asset.type === "PROPERTY",
    jewellery: (asset) => asset.type === "JEWELLERY",
    fd: (asset) => asset.type === "FD",
    others: (asset) => asset.type === "OTHERS",
  };

  //
  useEffect(() => {
    if (view) {
      setFilteredAsset(data.filter(filters[view]));
    } else {
      let groupedAssets: {
        type: string;
        currentValue: number;
        compareValue: number;
      }[] = [];

      data.forEach((asset) => {
        if (asset.quantity !== "0") {
          const existingType = groupedAssets.find(
            (data) => data.type === asset.type
          );

          if (existingType) {
            existingType.currentValue += asset.currentValue;
            existingType.compareValue += asset.compareValue;
          } else {
            groupedAssets.push({
              type: asset.type,
              currentValue: asset.symbol
                ? asset.currentValue
                : asset.currentValue,
              compareValue: asset.compareValue,
            });
          }
        }
      });
      setGroupedAsset(groupedAssets);
      setFilteredAsset(data);
    }
  }, [data]);

  const handleSort = (sortBy: string) => {
    if (!view) {
      if (sortBy === "Invested Amount") {
        setGroupedAsset(
          groupedAsset?.sort((a, b) =>
            sortOrder === "asc"
              ? a.compareValue - b.compareValue
              : b.compareValue - a.compareValue
          )
        );
      } else if (sortBy === "Current Value") {
        setGroupedAsset(
          groupedAsset?.sort((a, b) =>
            sortOrder === "asc"
              ? a.currentValue - b.currentValue
              : b.currentValue - a.currentValue
          )
        );
      } else if (sortBy === "Profit/Loss") {
        setGroupedAsset(
          groupedAsset?.sort((a, b) =>
            sortOrder === "asc"
              ? ((a.currentValue - a.compareValue) * 100) / a.compareValue -
                ((b.currentValue - b.compareValue) * 100) / b.compareValue
              : ((b.currentValue - b.compareValue) * 100) / b.compareValue -
                ((a.currentValue - a.compareValue) * 100) / a.compareValue
          )
        );
      }
    } else {
      if (sortBy === "Quantity") {
        setFilteredAsset(
          filteredAsset?.sort((a, b) =>
            sortOrder === "asc"
              ? +a.quantity - +b.quantity
              : +b.quantity - +a.quantity
          )
        );
      } else if (sortBy === "Invested Value") {
        setFilteredAsset(
          filteredAsset?.sort((a, b) =>
            sortOrder === "asc"
              ? a.compareValue - b.compareValue
              : b.compareValue - a.compareValue
          )
        );
      } else if (sortBy === "Current Value") {
        setFilteredAsset(
          filteredAsset?.sort((a, b) =>
            sortOrder === "asc"
              ? a.currentValue - b.currentValue
              : b.currentValue - a.currentValue
          )
        );
      }
    }
  };

  return (
    filteredAsset &&
    filteredAsset.length > 0 && (
      <>
        <Table>
          <ScrollArea className={cn("w-full", view ? "h-[33vh]" : "h-[41vh]")}>
            <TableHeader className="bg-secondary sticky top-0">
              {view ? (
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right w-[128px]">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        handleSort("Quantity");
                      }}
                    >
                      {filteredAsset.find((asset) => asset.type === "FD")
                        ? "Interest rate (%)"
                        : "Quantity"}
                      <ArrowUpDown className="ml-4 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right w-[128px]">
                    Avg. Buying Price
                  </TableHead>
                  <TableHead className="text-right w-[128px]">
                    Buying Currency
                  </TableHead>
                  <TableHead className="text-right w-[136px]">
                    Previous Close
                  </TableHead>
                  <TableHead className="text-right w-[128px]">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        handleSort("Invested Value");
                      }}
                    >
                      Invested Value
                      <ArrowUpDown className="ml-4 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right w-[128px]">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        handleSort("Current Value");
                      }}
                    >
                      Current Value
                      <ArrowUpDown className="ml-4 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              ) : (
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        handleSort("Invested Amount");
                      }}
                    >
                      Invested Amount
                      <ArrowUpDown className="ml-4 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        handleSort("Current Value");
                      }}
                    >
                      Current Value
                      <ArrowUpDown className="ml-4 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        handleSort("Profit/Loss");
                      }}
                    >
                      Profit/Loss %
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {view
                ? filteredAsset.map((asset, index) => {
                    return (
                      +asset.quantity > 0 && (
                        <TableRow
                          key={index}
                          className="cursor-pointer"
                          onClick={() => {
                            setOpen(true);
                            asset.symbol !== null
                              ? setAssetToView((prev) => ({
                                  ...prev,
                                  symbol: asset.symbol,
                                  exchange: asset.exchange,
                                  name: asset.name,
                                  quantity: asset.quantity,
                                  prevClose: asset.prevClose,
                                  currentValue: asset.currentValue,
                                  type: asset.type,
                                  buyPrice: asset.buyPrice,
                                  buyCurrency: asset.buyCurrency,
                                }))
                              : setManualAsset(asset);
                          }}
                        >
                          <TableCell>{asset.name}</TableCell>
                          <TableCell className="text-right px-8">
                            {visible
                              ? parseFloat(asset.quantity).toLocaleString(
                                  "en-IN"
                                )
                              : "* ".repeat(5)}
                          </TableCell>
                          <TableCell className="text-right">
                            {parseFloat(
                              (+asset.buyPrice).toFixed(2)
                            ).toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-right">
                            {asset.buyCurrency}
                          </TableCell>
                          <TableCell className="text-right">
                            {parseFloat(asset.prevClose).toLocaleString(
                              "en-IN"
                            )}
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <div className="flex flex-col">
                              {visible
                                ? asset.compareValue.toLocaleString("en-IN")
                                : "* ".repeat(5)}
                            </div>
                          </TableCell>
                          <TableCell
                            className={`text-right px-8 ${
                              asset.prevClose > asset.buyPrice
                                ? "text-green-400"
                                : asset.prevClose < asset.buyPrice
                                ? "text-red-400"
                                : ""
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
                                    ((+asset.prevClose - +asset.buyPrice) *
                                      100) /
                                    +asset.buyPrice
                                  ).toFixed(2)}
                                  %
                                  <ArrowUpIcon className="h-4 w-4 ml-2" />)
                                </span>
                              ) : asset.prevClose < asset.buyPrice ? (
                                <span className="flex items-center justify-end">
                                  (
                                  {(
                                    ((+asset.buyPrice - +asset.prevClose) *
                                      100) /
                                    +asset.buyPrice
                                  ).toFixed(2)}
                                  %
                                  <ArrowDownIcon className="h-4 w-4 ml-2" />)
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    );
                  })
                : groupedAsset &&
                  groupedAsset.map((asset, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {asset.type === "EQUITY" ? "STOCKS" : asset.type}
                        </TableCell>
                        <TableCell className="text-right px-8">
                          {visible
                            ? parseFloat(
                                asset.compareValue.toFixed(2)
                              ).toLocaleString("en-IN")
                            : "* ".repeat(5)}
                        </TableCell>
                        <TableCell className="text-right px-8">
                          {visible
                            ? parseFloat(
                                asset.currentValue.toFixed(2)
                              ).toLocaleString("en-IN")
                            : "* ".repeat(5)}
                          <div
                            className={cn(
                              "flex justify-end items-center",
                              asset.currentValue > asset.compareValue
                                ? "text-green-400"
                                : asset.currentValue < asset.compareValue
                                ? "text-red-400"
                                : "hidden"
                            )}
                          >
                            (
                            {visible
                              ? (+(
                                  asset.currentValue - asset.compareValue
                                ).toFixed(2)).toLocaleString("en-IN")
                              : "* ".repeat(5)}
                            {asset.currentValue > asset.compareValue ? (
                              <ArrowUpIcon className="h-4 w-4 ml-2" />
                            ) : asset.currentValue < asset.compareValue ? (
                              <ArrowDownIcon className="h-4 w-4 ml-2" />
                            ) : (
                              ""
                            )}
                            )
                          </div>
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right px-8",
                            asset.currentValue > asset.compareValue
                              ? "text-green-400"
                              : asset.currentValue < asset.compareValue
                              ? "text-red-400"
                              : ""
                          )}
                        >
                          <div className="flex justify-end items-center">
                            (
                            {(
                              ((asset.currentValue - asset.compareValue) *
                                100) /
                              asset.compareValue
                            ).toFixed(2)}
                            %
                            {asset.currentValue > asset.compareValue ? (
                              <ArrowUpIcon className="h-4 w-4 ml-2" />
                            ) : asset.currentValue < asset.compareValue ? (
                              <ArrowDownIcon className="h-4 w-4 ml-2" />
                            ) : (
                              ""
                            )}
                            )
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </ScrollArea>
        </Table>
        {historicalData && open && (
          <ViewAsset
            open={open}
            setOpen={setOpen}
            assetToView={assetToView}
            manualAsset={manualAsset}
            historicalData={historicalData}
          />
        )}
      </>
    )
  );
}

export default AssetTable;
