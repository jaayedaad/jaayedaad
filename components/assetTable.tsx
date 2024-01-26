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

type Asset = {
  id: string;
  name: string;
  symbol: string;
  quantity: string;
  buyPrice: string;
  buyCurrency: string;
  prevClose: string;
  buyDate: Date;
  userId: string;
};

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
    fetch(
      "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/inr.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setConversionRate(data.inr);
      });
  }, []);
  return (
    assets.length > 0 && (
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sr No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right w-[100px]">Quantity</TableHead>
            <TableHead className="text-right">Buy Price</TableHead>
            <TableHead className="text-center w-[100px]">
              Buy Currency
            </TableHead>
            <TableHead className="text-center">Buy Date</TableHead>
            <TableHead className="text-center">Previous Close</TableHead>
            <TableHead className="text-center w-[125px]">
              Current Value (in INR)
            </TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
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
                <TableCell className="text-center">
                  {asset.buyCurrency}
                </TableCell>
                <TableCell className="text-center">
                  {asset.buyDate.toString().split("T")[0]}
                </TableCell>
                <TableCell className="text-center">
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
                    {(asset.buyCurrency === "INR"
                      ? +asset.buyPrice * +asset.quantity
                      : +asset.buyPrice * +asset.quantity * +conversionRate
                    ).toLocaleString()}
                    {asset.prevClose > asset.buyPrice ? (
                      <span className="flex items-center justify-end">
                        (
                        {((+asset.prevClose * 10) / +asset.buyPrice).toFixed(2)}
                        %
                        <ArrowUpIcon className="h-4 w-4 ml-2" />)
                      </span>
                    ) : (
                      <span className="flex items-center justify-end">
                        (
                        {(
                          100 -
                          (+asset.prevClose * 100) / +asset.buyPrice
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
