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

type searchResultProps = {
  results: Array<any>;
};

const SearchResults = ({ results }: searchResultProps) => {
  const [assetQuantity, setAssetQuantity] = useState<string>("");
  const [assetBuyPrice, setAssetBuyPrice] = useState<string>("");
  const [buyDate, setBuyDate] = useState<string>("");
  const [buyCurrency, setBuyCurrency] = useState("INR");

  const handleAssetQuantiy = (value: string) => {
    setAssetQuantity(value);
  };
  const handleAssetBuyPrice = (value: string) => {
    setAssetBuyPrice(value);
  };
  const handleDateSelect = (selectedDate: Date) => {
    setBuyDate(selectedDate.toISOString());
  };

  // Add assets handler
  const handleAddAssets = async (shortname: string, symbol: string) => {
    const asset = {
      shortname: shortname,
      symbol: symbol,
      quantity: assetQuantity,
      buyPrice: assetBuyPrice,
      buyDate: buyDate,
      buyCurrency: buyCurrency,
    };
    await fetch("/api/assets/add", {
      method: "POST",
      body: JSON.stringify(asset),
    });
    setAssetQuantity("");
    setAssetBuyPrice("");
    setBuyDate("");
  };
  return results.length > 0 ? (
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
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        Add{" "}
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
                        className="col-span-2 no-spinner"
                        type="number"
                        value={assetQuantity}
                        onChange={(e) => {
                          handleAssetQuantiy(e.target.value);
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="Buy Price" className="text-right">
                        Buy Date:
                      </Label>
                      <div className="col-span-2">
                        <DatePicker onSelect={handleDateSelect} />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="Buy Price" className="text-right">
                        Buy Price
                      </Label>
                      <Input
                        id="buyPrice"
                        className="col-span-1 no-spinner"
                        type="number"
                        value={assetBuyPrice}
                        onChange={(e) => {
                          handleAssetBuyPrice(e.target.value);
                        }}
                      />
                      <Select
                        onValueChange={(value) => {
                          setBuyCurrency(value);
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
                      <DialogClose asChild>
                        <Button
                          onClick={() =>
                            handleAddAssets(result?.shortname, result?.symbol)
                          }
                        >
                          Confirm
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        );
      })}
    </Table>
  ) : (
    <div className="text-center mt-24">Search for any assets!</div>
  );
};

export default SearchResults;
