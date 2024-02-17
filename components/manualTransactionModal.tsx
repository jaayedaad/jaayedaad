import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { categories } from "@/constants/category";
import { currencies } from "@/constants/currency";
import { toast } from "sonner";
import { useData } from "@/contexts/data-context";

function ManualTransactionModal() {
  const { updateData } = useData();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualTransaction, setManualTransaction] = useState({
    name: "",
    type: "PROPERTY",
    quantity: "",
    buyCurrency: "INR",
    price: "",
    currentPrice: "",
    date: "",
  });

  const handleDateSelect = (selectedDate: Date) => {
    setManualTransaction((prev) => ({
      ...prev,
      date: selectedDate.toISOString(),
    }));
  };

  async function handleManualBuyTransaction() {
    setLoading(true);

    const { price, date, ...data } = manualTransaction;
    const asset = {
      ...data,
      buyPrice: price,
      buyDate: date,
      isManualEntry: true,
    };

    await fetch("/api/assets/add", {
      method: "POST",
      body: JSON.stringify(asset),
    });
    updateData();
    setLoading(false);
    setOpen(false);
    toast.success("Asset added successfully");
    // Reset the manual transaction states
    setManualTransaction({
      name: "",
      type: "PROPERTY",
      quantity: "",
      buyCurrency: "",
      price: "",
      currentPrice: "",
      date: "",
    });
  }

  async function handleManualSellTransaction() {
    setLoading(true);

    const asset = manualTransaction;

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
          // Reset the manual transaction states
          setManualTransaction({
            name: "",
            type: "PROPERTY",
            quantity: "",
            buyCurrency: "",
            price: "",
            currentPrice: "",
            date: "",
          });
        }
        if (data.success) {
          setLoading(false);
          setOpen(false);
          updateData();
          toast.success(data.success);
          // Reset the manual transaction states
          setManualTransaction({
            name: "",
            type: "PROPERTY",
            quantity: "",
            buyCurrency: "",
            price: "",
            currentPrice: "",
            date: "",
          });
        }
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Manual</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add manual transactions</DialogTitle>
          <DialogDescription>For assets like cars, land, etc</DialogDescription>
          <div className="grid grid-cols-4 py-4 gap-4">
            <div className="col-span-1 self-center">Name</div>
            <Input
              className="col-span-3"
              placeholder="Asset name"
              value={manualTransaction.name}
              onChange={(e) =>
                setManualTransaction((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <div className="col-span-1 self-center">Category</div>
            <div className="col-span-3">
              <Select
                onValueChange={(value) => {
                  setManualTransaction((prev) => ({
                    ...prev,
                    type: value,
                  }));
                }}
                defaultValue="PROPERTY"
              >
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => {
                    return (
                      <SelectItem key={category.label} value={category.label}>
                        {category.value}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 self-center">Quantity</div>
            <Input
              className="col-span-2 no-spinner"
              type="number"
              value={manualTransaction.quantity}
              onChange={(e) =>
                setManualTransaction((prev) => ({
                  ...prev,
                  quantity: e.target.value,
                }))
              }
              placeholder="Quantity"
            />
            <Select
              onValueChange={(value) => {
                setManualTransaction((prev) => ({
                  ...prev,
                  buyCurrency: value,
                }));
              }}
              defaultValue="INR"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => {
                  return (
                    <SelectItem key={currency.label} value={currency.label}>
                      {currency.value}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <div className="col-span-1 self-center">Buy/Sell price</div>
            <Input
              className="col-span-3 no-spinner"
              type="number"
              value={manualTransaction.price}
              onChange={(e) =>
                setManualTransaction((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              placeholder="Price"
            />
            <div className="col-span-1 self-center">Current price</div>
            <Input
              className="col-span-3 no-spinner"
              type="number"
              value={manualTransaction.currentPrice}
              onChange={(e) =>
                setManualTransaction((prev) => ({
                  ...prev,
                  currentPrice: e.target.value,
                }))
              }
              placeholder="Current price"
            />
            <div className="col-span-1 self-center">Buy date</div>
            <div className="col-span-3">
              <DatePicker onSelect={handleDateSelect} />
            </div>
          </div>
          <DialogFooter>
            <div className="flex gap-2">
              <Button
                onClick={() => handleManualBuyTransaction()}
                disabled={loading}
              >
                Buy
              </Button>
              <Button
                onClick={() => handleManualSellTransaction()}
                disabled={loading}
              >
                Sell
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ManualTransactionModal;
