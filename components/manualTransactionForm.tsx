import React, { useState } from "react";
import { categories as builtInCategories } from "@/constants/category";
import { currencies } from "@/constants/currency";
import { useData } from "@/contexts/data-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

interface ManualTransactionFormPropsType {
  modalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ManualTransactionForm({ modalOpen }: ManualTransactionFormPropsType) {
  const { updateData, user } = useData();
  const { defaultCurrency } = useCurrency();
  user?.usersManualCategories.forEach((manualCategory) => {
    const existingCategory = builtInCategories.some(
      (category) => category.value === manualCategory.name
    );
    if (!existingCategory) {
      builtInCategories.splice(builtInCategories.length - 1, 0, {
        value: manualCategory.name,
        label: manualCategory.name,
      });
    }
  });
  const [loading, setLoading] = useState(false);
  const [manualTransaction, setManualTransaction] = useState({
    name: "",
    type: "Property",
    quantity: "",
    buyCurrency: defaultCurrency.toUpperCase(),
    price: "",
    currentPrice: "",
    date: "",
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("property");
  const [commandSearch, setCommandSearch] = useState("");
  const [categories, setCategories] = useState(builtInCategories);

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
    modalOpen(false);
    toast.success("Transaction confirmed!");
    // Reset the manual transaction states
    setManualTransaction({
      name: "",
      type: "Property",
      quantity: "",
      buyCurrency: defaultCurrency.toUpperCase(),
      price: "",
      currentPrice: "",
      date: "",
    });
  }

  async function handleManualSellTransaction() {
    setLoading(true);

    const asset = {
      name: manualTransaction.name,
      quantity: manualTransaction.quantity,
      price: manualTransaction.price,
      date: manualTransaction.date,
    };

    fetch("/api/assets/sell", {
      method: "PUT",
      body: JSON.stringify(asset),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setLoading(false);
          toast.error(data.error);
          // Reset the manual transaction states
          setManualTransaction({
            name: "",
            type: "Property",
            quantity: "",
            buyCurrency: defaultCurrency.toUpperCase(),
            price: "",
            currentPrice: "",
            date: "",
          });
        }
        if (data.success) {
          setLoading(false);
          modalOpen(false);
          updateData();
          toast.success(data.success);
          // Reset the manual transaction states
          setManualTransaction({
            name: "",
            type: "Property",
            quantity: "",
            buyCurrency: defaultCurrency.toUpperCase(),
            price: "",
            currentPrice: "",
            date: "",
          });
        }
      });
  }

  return (
    <>
      <Separator />
      <div className="mt-4">
        <div className="text-sm text-muted-foreground">
          Make transactions for assets like property, jewellery, etc
        </div>
        <div className="grid grid-cols-4 py-4 gap-4">
          <div className="col-span-1 self-center">Category</div>
          <div className="col-span-3">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {value &&
                    categories.find(
                      (category) => category.value.toLowerCase() === value
                    )?.label}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search category..."
                    onValueChange={(value) => setCommandSearch(value)}
                  />
                  <CommandEmpty>
                    <Button
                      variant="link"
                      onClick={() => {
                        const newCategory = {
                          label: commandSearch,
                          value: commandSearch,
                        };
                        setCategories((prev) => {
                          const insertIndex = prev.length - 1;
                          const newCategories = [...prev];
                          newCategories.splice(insertIndex, 0, newCategory); // Insert the new category at the second last position
                          return newCategories;
                        });
                        setValue(commandSearch);
                        setManualTransaction((prev) => ({
                          ...prev,
                          type: commandSearch,
                        }));
                        setOpen(false);
                      }}
                    >
                      + add category
                    </Button>
                  </CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.value}
                        value={category.value}
                        className={`${
                          value !== category.value.toLowerCase()
                            ? "text-muted-foreground"
                            : "text-white bg-muted"
                        }`}
                        onSelect={(currentValue) => {
                          setValue(currentValue);
                          setManualTransaction((prev) => ({
                            ...prev,
                            type: currentValue,
                          }));
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === category.value.toLowerCase()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {category.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="col-span-1 self-center">Name</div>
          <Input
            className="col-span-3"
            placeholder={`${
              manualTransaction.type === "FD" ? "Bank Name" : "Asset name"
            }`}
            value={manualTransaction.name}
            onChange={(e) =>
              setManualTransaction((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
          <div className="col-span-1 self-center">
            {manualTransaction.type === "FD" ? "Interest rate" : "Quantity"}
          </div>
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
            placeholder={
              manualTransaction.type === "FD"
                ? "Interest rate (p.a)"
                : "Quantity"
            }
          />
          <Select
            onValueChange={(value) => {
              setManualTransaction((prev) => ({
                ...prev,
                buyCurrency: value,
              }));
            }}
            defaultValue={defaultCurrency.toUpperCase()}
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
          <div className="col-span-1 self-center">Date</div>
          <div className="col-span-3">
            <DatePicker onSelect={handleDateSelect} />
          </div>
          <div className="col-span-1 self-center">
            {manualTransaction.type === "FD"
              ? "Principal Amount"
              : "Your price"}
          </div>
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
            placeholder={
              manualTransaction.type === "FD"
                ? "Principal amount"
                : "Unit price"
            }
          />
          <div
            className={cn(
              "col-span-1 self-center",
              manualTransaction.type === "FD" && "invisible"
            )}
          >
            Current price
          </div>
          <Input
            className={cn(
              "col-span-3 no-spinner",
              manualTransaction.type === "FD" && "invisible"
            )}
            type="number"
            value={manualTransaction.currentPrice}
            onChange={(e) =>
              setManualTransaction((prev) => ({
                ...prev,
                currentPrice: e.target.value,
              }))
            }
            placeholder="Current unit price"
          />
          <div className="col-span-2 col-start-3 flex gap-2">
            <Button
              className="w-full"
              onClick={() => handleManualBuyTransaction()}
              disabled={loading}
            >
              {manualTransaction.type === "FD" ? "Create" : "Buy"}
            </Button>
            <Button
              className="w-full"
              onClick={() => handleManualSellTransaction()}
              disabled={loading}
            >
              {manualTransaction.type === "FD" ? "Break" : "Sell"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManualTransactionForm;
