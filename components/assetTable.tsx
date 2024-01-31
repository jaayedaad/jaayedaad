"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { getConversionRate } from "@/actions/getConversionRateAction";
import { Asset } from "@/actions/getAssetsAction";

function AssetTable({ assets }: { assets: Asset[] }) {
  const [conversionRate, setConversionRate] = useState("");
  const handleRemoveAsset = async (id: string) => {
    await fetch("/api/assets/remove", {
      method: "POST",
      body: JSON.stringify({ assetId: id }),
    });
  };

  // Get USD to INR conversion rate
  useEffect(() => {
    getConversionRate().then((conversionRate) => {
      setConversionRate(conversionRate);
    });
  }, []);
  return (
    assets.length > 0 && (
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[72px]">Sr No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right w-[128px]">Quantity</TableHead>
            <TableHead className="text-right w-[128px]">Buy Price</TableHead>
            <TableHead className="text-right w-[128px]">Buy Currency</TableHead>
            <TableHead className="text-right w-[136px]">
              Previous Close
            </TableHead>
            <TableHead className="text-right w-[128px]">
              Current Value (in INR)
            </TableHead>
            <TableHead className="text-center w-[128px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.symbol}</TableCell>
                <TableCell className="text-right">
                  {asset.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {asset.buyPrice.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {asset.buyCurrency}
                </TableCell>
                <TableCell className="text-right">{asset?.prevClose}</TableCell>
                <TableCell
                  className={`text-right ${
                    asset.prevClose > asset.buyPrice
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  <div className="flex flex-col">
                    {(asset.buyCurrency === "INR"
                      ? +asset.prevClose * +asset.quantity
                      : +asset.prevClose * +asset.quantity * +conversionRate
                    ).toLocaleString()}
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
                <TableCell>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      handleRemoveAsset(asset.id);
                    }}
                  >
                    remove
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    )
  );
}

export default AssetTable;
