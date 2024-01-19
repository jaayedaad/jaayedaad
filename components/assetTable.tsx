"use client";
import { Asset } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function AssetTable({ assets }: { assets: Asset[] }) {
  const handleRemoveAsset = async (id: string) => {
    await fetch("/api/assets/remove", {
      method: "POST",
      body: JSON.stringify({ assetId: id }),
    });
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Sr No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Buy Price</TableHead>
          <TableHead>Buy Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets &&
          assets.map((asset, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.symbol}</TableCell>
                <TableCell className="text-right">{asset.quantity}</TableCell>
                <TableCell className="text-right">{asset.buyPrice}</TableCell>
                <TableCell>{asset.buyDate.toString().split("T")[0]}</TableCell>
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
  );
}

export default AssetTable;
