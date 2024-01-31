"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { currencies } from "@/constants/currency";
import { toast } from "sonner";

type searchResultProps = {
  results: Array<any>;
};

const SearchResults = ({ results }: searchResultProps) => {
  const [assetQuantity, setAssetQuantity] = useState<string>("");
  const [assetPrice, setAssetPrice] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [currency, setCurrency] = useState("INR");

  const handleAssetQuantiy = (value: string) => {
    setAssetQuantity(value);
  };
  const handleAssetPrice = (value: string) => {
    setAssetPrice(value);
  };
  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate.toISOString());
  };

  // Add assets handler
  const handleAddAssets = async (
    shortname: string,
    symbol: string,
    type: string
  ) => {
    const asset = {
      shortname: shortname,
      symbol: symbol,
      quantity: assetQuantity,
      buyPrice: assetPrice,
      buyDate: date,
      type: type,
      buyCurrency: currency,
    };

    await fetch("/api/assets/add", {
      method: "POST",
      body: JSON.stringify(asset),
    });

    setAssetQuantity("");
    setAssetPrice("");
    setDate("");
    setCurrency("INR");
  };

  // Sell assets handler
  const handleSellAssets = async (shortname: string, symbol: string) => {
    const asset = {
      shortname: shortname,
      symbol: symbol,
      quantity: assetQuantity,
      sellPrice: assetPrice,
      sellDate: date,
      sellCurrency: currency,
    };

    fetch("/api/assets/sell", {
      method: "PUT",
      body: JSON.stringify(asset),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
          setAssetQuantity("");
          setAssetPrice("");
          setDate("");
          setCurrency("INR");
        }
      });
  };
  return (
    results.length > 0 && (
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sr No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]">Symbol</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        {results.map((result, index) => {
          return (
            result.shortname && (
              <TableBody key={index} className="overflow-y-hidden">
                <TableRow>
                  <TableCell className="font-medium text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell>{result?.shortname}</TableCell>
                  <TableCell>{result?.symbol}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">Add</Button>
                      </DialogTrigger>
                      <DialogContent className="w-fit">
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            Make transaction for{" "}
                            <span className="text-bold text-foreground">
                              {result?.shortname}
                            </span>{" "}
                            to your portfolio
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="quantity" className="text-right">
                            Quantity
                          </Label>
                          <Input
                            id="quantity"
                            className="col-span-3 no-spinner"
                            type="number"
                            value={assetQuantity}
                            onChange={(e) => {
                              handleAssetQuantiy(e.target.value);
                            }}
                          />
                          <Label htmlFor="Buy Price" className="text-right">
                            Date
                          </Label>
                          <div className="col-span-3">
                            <DatePicker onSelect={handleDateSelect} />
                          </div>
                          <Label htmlFor="Buy Price" className="text-right">
                            Price
                          </Label>
                          <Input
                            id="buyPrice"
                            className="col-span-2 no-spinner"
                            type="number"
                            value={assetPrice}
                            onChange={(e) => {
                              handleAssetPrice(e.target.value);
                            }}
                          />
                          <Select
                            onValueChange={(value) => {
                              setCurrency(value);
                            }}
                            defaultValue="INR"
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((currency) => {
                                return (
                                  <SelectItem
                                    key={currency.label}
                                    value={currency.label}
                                  >
                                    {currency.value}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <div className="grid grid-cols-2 gap-2">
                            <DialogClose asChild>
                              <Button
                                onClick={() =>
                                  handleAddAssets(
                                    result?.shortname,
                                    result?.symbol,
                                    result?.quoteType
                                  )
                                }
                              >
                                Add
                              </Button>
                            </DialogClose>
                            <Button
                              onClick={() =>
                                handleSellAssets(
                                  result?.shortname,
                                  result?.symbol
                                )
                              }
                            >
                              Sell
                            </Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              </TableBody>
            )
          );
        })}
      </Table>
    )
  );
};

export default SearchResults;
