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
import { useData } from "@/contexts/data-context";
import { ScrollArea } from "./ui/scroll-area";

type searchResultProps = {
  results: Array<any>;
};

const SearchResults = ({ results }: searchResultProps) => {
  const { updateData } = useData();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
    name: string,
    symbol: string,
    type: string,
    exchange: string
  ) => {
    setLoading(true);
    const asset = {
      name: name,
      symbol: symbol,
      quantity: assetQuantity,
      buyPrice: assetPrice,
      buyDate: date,
      type: type,
      exchange: exchange,
      buyCurrency: currency,
    };

    await fetch("/api/assets/add", {
      method: "POST",
      body: JSON.stringify(asset),
    });
    setLoading(false);
    setOpen(false);
    toast.success("Asset added successfully");
    setAssetQuantity("");
    setAssetPrice("");
    setDate("");
    setCurrency("INR");
    updateData();
  };

  // Sell assets handler
  const handleSellAssets = async (name: string, symbol: string) => {
    setLoading(true);
    const asset = {
      name: name,
      symbol: symbol,
      quantity: assetQuantity,
      price: assetPrice,
      date: date,
      sellCurrency: currency,
    };

    fetch("/api/assets/sell", {
      method: "PUT",
      body: JSON.stringify(asset),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setLoading(false);
          setOpen(false);
          toast.error(data.error);
          setAssetQuantity("");
          setAssetPrice("");
          setDate("");
          setCurrency("INR");
        }
        if (data.success) {
          setLoading(false);
          setOpen(false);
          toast.success(data.success);
          setAssetQuantity("");
          setAssetPrice("");
          setDate("");
          setCurrency("INR");
          updateData();
        }
      });
  };
  return (
    results.length > 0 && (
      <ScrollArea className="h-[55vh]">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px] text-right">Exchange</TableHead>
              <TableHead className="w-[100px] text-right">Symbol</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-hidden">
            {results.map((result, index) => {
              return (
                result.shortname && (
                  <TableRow key={index}>
                    <TableCell>{result?.shortname}</TableCell>
                    <TableCell className="text-right">
                      {result?.exchange}
                    </TableCell>
                    <TableCell className="text-right">
                      {result?.symbol}
                    </TableCell>
                    <TableCell>
                      <Dialog open={open} onOpenChange={setOpen}>
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
                              <Button
                                onClick={() =>
                                  handleAddAssets(
                                    result?.shortname,
                                    result?.symbol,
                                    result?.quoteType,
                                    result?.exchange
                                  )
                                }
                              >
                                Add
                              </Button>
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
                )
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    )
  );
};

export default SearchResults;
