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

function AssetTable({ assets }: { assets: Asset[] }) {
  return (
    assets.length > 0 && (
      <Table>
        <ScrollArea className="h-60 w-full">
          <TableHeader className="bg-secondary sticky top-0">
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
          </TableHeader>
          <TableBody>
            {assets.map((asset, index) => {
              return (
                +asset.quantity > 0 && (
                  <TableRow key={index}>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell className="text-right">
                      {asset.quantity.toLocaleString()}
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
                        {asset.currentValue.toLocaleString()}
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
            })}
          </TableBody>
        </ScrollArea>
      </Table>
    )
  );
}

export default AssetTable;
