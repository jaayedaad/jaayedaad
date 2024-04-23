import React, { useState } from "react";
import {
  categories as builtInCategories,
  defaultCategories,
} from "@/constants/category";
import { currencies } from "@/constants/currency";
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
import { cn } from "@/lib/helper";
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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import DynamicIcon from "./dynamicIcon";
import { manualCategoryIcons as iconsArray } from "@/constants/manualCategoryIcons";
import { TManualCategoryIcons, TUserManualCategory } from "@/types/types";

interface ManualTransactionFormPropsType {
  usersManualCategories: TUserManualCategory[];
  modalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultCurrency: string;
}

function ManualTransactionForm({
  usersManualCategories,
  modalOpen,
  defaultCurrency,
}: ManualTransactionFormPropsType) {
  usersManualCategories.forEach((manualCategory) => {
    const existingCategory = builtInCategories.some(
      (category) => category.value === manualCategory.name
    );
    if (!existingCategory) {
      builtInCategories.splice(builtInCategories.length - 1, 0, {
        value: manualCategory.name,
        label: manualCategory.name,
        icon: manualCategory.icon,
      });
    }
  });
  const [buying, setBuying] = useState(false);
  const [selling, setSelling] = useState(false);
  const [manualTransaction, setManualTransaction] = useState<{
    name: string;
    category: string;
    symbol: null | string;
    exchange: null | string;
    quantity: string;
    buyCurrency: string;
    price: string;
    currentPrice: string;
    date: string;
  }>({
    name: "",
    category: "Common Stock",
    symbol: null,
    exchange: null,
    quantity: "",
    buyCurrency: defaultCurrency.toUpperCase(),
    price: "",
    currentPrice: "",
    date: "",
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("common stock");
  const [commandSearch, setCommandSearch] = useState("");
  const [categories, setCategories] = useState(builtInCategories);
  const [icon, setIcon] = useState<TManualCategoryIcons>("candlestick-chart");

  const handleDateSelect = (selectedDate: Date) => {
    setManualTransaction((prev) => ({
      ...prev,
      date: selectedDate.toISOString(),
    }));
  };

  async function handleManualBuyTransaction() {
    setBuying(true);

    const { price, date, ...data } = manualTransaction;
    const asset = {
      ...data,
      icon: icon,
      buyPrice: price,
      buyDate: date,
      source: "manual",
    };

    await fetch("/api/assets/add", {
      method: "POST",
      body: JSON.stringify(asset),
    });
    setBuying(false);
    modalOpen(false);
    toast.success("Transaction confirmed!");
    // Reset the manual transaction states
    setManualTransaction({
      name: "",
      category: "Common Stock",
      symbol: null,
      exchange: null,
      quantity: "",
      buyCurrency: defaultCurrency.toUpperCase(),
      price: "",
      currentPrice: "",
      date: "",
    });

    window.location.reload();
  }

  async function handleManualSellTransaction() {
    setSelling(true);

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
          setSelling(false);
          toast.error(data.error);
        }
        if (data.success) {
          setSelling(false);
          toast.success(data.success);
          modalOpen(false);
          // Reset the manual transaction states
          setManualTransaction({
            name: "",
            category: "Common Stock",
            quantity: "",
            symbol: null,
            exchange: null,
            buyCurrency: defaultCurrency.toUpperCase(),
            price: "",
            currentPrice: "",
            date: "",
          });
          window.location.reload();
        }
      });
  }

  return (
    <div className="grid grid-cols-4 pt-4 gap-4">
      <div className="col-span-1 self-center after:content-['*'] after:ml-0.5 after:text-red-500">
        Category
      </div>
      <div className="col-span-3 flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              role="combobox"
              aria-expanded={open}
              className="w-fit px-3 justify-between"
            >
              <DynamicIcon className="h-4 w-4" name={icon} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Command>
              <CommandInput placeholder="Search icon..." />
              <CommandEmpty>No such icon found.</CommandEmpty>
              <CommandGroup className="h-[55vh]">
                {iconsArray.map((iconName) => (
                  <CommandItem
                    key={iconName}
                    value={iconName}
                    onSelect={() => {
                      setIcon(iconName);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        icon === iconName ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <DynamicIcon className="h-4 w-4 mr-2" name={iconName} />
                    {iconName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
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
                      icon: icon,
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
                      category: commandSearch,
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
                      setIcon(category.icon);
                      setManualTransaction((prev) => ({
                        ...prev,
                        category: category.value,
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
      <div className="col-span-1 self-center after:content-['*'] after:ml-0.5 after:text-red-500">
        Name
      </div>
      <Input
        className="col-span-3"
        placeholder={`${
          manualTransaction.category === "Deposits" ? "Bank Name" : "Asset name"
        }`}
        value={manualTransaction.name}
        onChange={(e) =>
          setManualTransaction((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
      />
      {defaultCategories.includes(manualTransaction.category.toLowerCase()) && (
        <>
          <div className="col-span-1 self-center after:content-['*'] after:ml-0.5 after:text-red-500">
            Symbol
          </div>
          <Input
            className="col-span-3"
            placeholder="Symbol"
            value={manualTransaction.symbol || ""}
            onChange={(e) =>
              setManualTransaction((prev) => ({
                ...prev,
                symbol: e.target.value,
              }))
            }
          />
          <div className="col-span-1 self-center after:content-['*'] after:ml-0.5 after:text-red-500">
            Exchange
          </div>
          <Input
            className="col-span-3"
            placeholder="Exchange"
            value={manualTransaction.exchange || ""}
            onChange={(e) =>
              setManualTransaction((prev) => ({
                ...prev,
                exchange: e.target.value,
              }))
            }
          />
        </>
      )}
      <div className="col-span-1 self-center after:content-['*'] after:ml-0.5 after:text-red-500">
        {manualTransaction.category === "Deposits"
          ? "Interest rate"
          : "Quantity"}
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
          manualTransaction.category === "Deposits"
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
      <div className="col-span-1 self-center after:content-['*'] after:ml-0.5 after:text-red-500">
        Date
      </div>
      <div className="col-span-3">
        <DatePicker onSelect={handleDateSelect} />
      </div>
      <div className="col-span-1 self-center after:content-['*'] after:ml-0.5 after:text-red-500">
        {manualTransaction.category === "Deposits"
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
          manualTransaction.category === "Deposits"
            ? "Principal amount"
            : "Unit price"
        }
      />
      <div
        className={cn(
          "col-span-1 self-center after:content-['*'] after:ml-0.5 after:text-red-500",
          manualTransaction.category === "Deposits" && "invisible"
        )}
      >
        Current price
      </div>
      <Input
        className={cn(
          "col-span-3 no-spinner",
          manualTransaction.category === "Deposits" && "invisible"
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
          disabled={buying}
        >
          {buying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {manualTransaction.category === "Deposits" ? "Create" : "Buy"}
        </Button>
        <Button
          className="w-full"
          onClick={() => handleManualSellTransaction()}
          disabled={selling}
        >
          {selling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {manualTransaction.category === "Deposits" ? "Break" : "Sell"}
        </Button>
      </div>
    </div>
  );
}

export default ManualTransactionForm;
