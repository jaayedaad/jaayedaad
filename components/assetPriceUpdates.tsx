"use client";
import React, { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "./ui/separator";
import { TAsset } from "@/types/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DatePicker } from "./ui/date-picker";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AssetPriceUpdatesProps {
  assetToView: TAsset;
}

function AssetPriceUpdates({ assetToView }: AssetPriceUpdatesProps) {
  const [showUpdatePriceForm, setShowUpdatePriceForm] = useState(false);
  const [updatePrice, setUpdatePrice] = useState("0");
  const [updateDate, setUpdateDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const handleUpdatePrice = async (assetId: string) => {
    setLoading(true);
    const assetUpdatePrice = {
      price: updatePrice,
      date: updateDate?.toISOString(),
      assetId: assetId,
    };

    if (updatePrice.trim() !== "" && +updatePrice > 0) {
      fetch("/api/assets/updateprice", {
        method: "POST",
        body: JSON.stringify(assetUpdatePrice),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setLoading(false);
            setShowUpdatePriceForm(false);
            toast.error(data.error);
          } else {
            setLoading(false);
            setShowUpdatePriceForm(false);
            setUpdatePrice(assetUpdatePrice.price);
            toast.success(data.success);
            window.location.reload();
          }
        });
    } else {
      toast.error("Price cannot be 0 or empty");
    }
  };

  return (
    <div className="mt-4">
      <Separator />
      <ScrollArea className="h-[212px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[128px]">Updated on</TableHead>
              <TableHead className="text-right">Updated price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetToView &&
              assetToView.assetPriceUpdates
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((priceUpdate) => {
                  const priceUpdateDate = new Date(priceUpdate.date.toString());
                  const formattedDate = `${priceUpdateDate
                    .getDate()
                    .toString()
                    .padStart(2, "0")}-${(priceUpdateDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${priceUpdateDate
                    .getFullYear()
                    .toString()}`;
                  return (
                    <TableRow
                      className="cursor-pointer"
                      key={priceUpdate.id}
                      //   onClick={() => {
                      //     setOpen(true);
                      //     setUpdatePriceToEdit(priceUpdate);
                      //   }}
                    >
                      <TableCell className="font-medium">
                        {formattedDate}
                      </TableCell>
                      <TableCell className="text-right">
                        {parseFloat(priceUpdate.price).toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="w-full mt-2 flex justify-end">
        <div className="flex gap-2 w-1/5">
          <Dialog
            open={showUpdatePriceForm}
            onOpenChange={setShowUpdatePriceForm}
          >
            <DialogTrigger asChild>
              <Button
                className="w-full"
                onClick={() => setShowUpdatePriceForm(true)}
              >
                Add new price
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add new price update</DialogTitle>
                <DialogDescription>
                  This price is used as a historical price of your asset
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-1 self-center">Price</div>
                <Input
                  className="col-span-4"
                  value={updatePrice}
                  placeholder="Latest price"
                  onChange={(e) => setUpdatePrice(e.target.value)}
                />
                <div className="col-span-1 self-center">Date</div>
                <div className="col-span-4">
                  <DatePicker onSelect={(value) => setUpdateDate(value)} />
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <Button
                  className="w-fit"
                  disabled={loading}
                  onClick={() => {
                    handleUpdatePrice(assetToView.id);
                  }}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default AssetPriceUpdates;
