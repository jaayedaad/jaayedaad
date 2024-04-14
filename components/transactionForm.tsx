import React, { useState } from "react";
import { Input } from "./ui/input";
import { DatePicker } from "./ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { currencies } from "@/constants/currency";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/helper";

interface transactionFormPropsType {
  previousClose?: string;
  selectedAsset: {
    prevClose?: string;
    instrument_name: string;
    symbol: string;
    instrument_type: string;
    exchange: string;
    currency: string;
    mic_code?: string;
    country?: string;
    exchange_timezone?: string;
  };
  modalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultCurrency: string;
}

const instrumentNameMappings: Record<string, string> = {
  "Common Stock": "Stocks",
  "Digital Currency": "Crypto",
  // Add other mappings here
};

function TransactionForm({
  previousClose,
  selectedAsset,
  modalOpen,
  defaultCurrency,
}: transactionFormPropsType) {
  const [buying, setBuying] = useState(false);
  const [selling, setSelling] = useState(false);
  const [assetQuantity, setAssetQuantity] = useState<string>("0");
  const [assetPrice, setAssetPrice] = useState(previousClose);
  const [currentPrice, setCurrentPrice] = useState<string>();
  const [date, setDate] = useState<string>("");
  const [currency, setCurrency] = useState(
    selectedAsset.currency.toUpperCase()
  );
  // Add assets handler
  const handleAddAssets = async (
    name: string,
    symbol: string,
    category: string,
    exchange: string
  ) => {
    setBuying(true);
    const asset = {
      name: name,
      symbol: (symbol.length && symbol) || null,
      quantity: assetQuantity,
      buyPrice: assetPrice,
      currentPrice: (currentPrice && currentPrice) || null,
      buyDate: date,
      category: category,
      exchange: (exchange.length && exchange) || null,
      isManualEntry:
        previousClose === "NaN" || !selectedAsset.symbol.length ? true : false,
      buyCurrency: currency,
    };

    await fetch("/api/assets/add", {
      method: "POST",
      body: JSON.stringify(asset),
    });
    setBuying(false);
    modalOpen(false);
    toast.success("Asset added successfully");
    setAssetQuantity("");
    setAssetPrice("");
    setDate("");
    setCurrency(defaultCurrency.toUpperCase());
    window.location.reload();
  };

  // Sell assets handler
  const handleSellAssets = async (instrument_name: string) => {
    setSelling(true);
    const asset = {
      name: instrument_name,
      quantity: assetQuantity,
      price: assetPrice,
      date: date,
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
          setAssetQuantity("");
          setAssetPrice("");
          setDate("");
          setCurrency(defaultCurrency.toUpperCase());
          window.location.reload();
        }
      });
  };

  const handleAssetQuantiy = (value: string) => {
    if(parseFloat(value) <= 0){
      toast.error("Quantity should be greater than 0");
      return;
    }
    setAssetQuantity(value);
  };
  const handleAssetPrice = (value: string) => {
    setAssetPrice(value);
  };
  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate.toISOString());
  };
  return (
    <>
      <div>
        <div className="grid grid-cols-4 pt-4 gap-4">
          <div className="text-base col-span-1">Category</div>
          <Input
            className="col-span-3 no-spinner"
            value={
              instrumentNameMappings[selectedAsset.instrument_type] ||
              selectedAsset.instrument_type
            }
            disabled
          />
          <div className="text-base col-span-1">Name</div>
          <Input
            className="col-span-3 no-spinner"
            value={selectedAsset.instrument_name}
            disabled
          />
          <div className="text-base col-span-1">Symbol</div>
          <Input
            className="col-span-3 no-spinner"
            value={selectedAsset.symbol.length ? selectedAsset.symbol : "-"}
            disabled
          />
          <div className="text-base col-span-1">Exchange</div>
          <Input
            className="col-span-3 no-spinner"
            value={selectedAsset.exchange.length ? selectedAsset.exchange : "-"}
            disabled
          />
          <div className="text-base col-span-1 after:content-['*'] after:ml-0.5 after:text-red-500">
            Quantity
          </div>
          <Input
            placeholder="Quantity"
            className="col-span-3 no-spinner"
            type="number"
            value={assetQuantity}
            onChange={(e) => {
              handleAssetQuantiy(e.target.value);
            }}
          />
          <div className="col-span-1 text-base after:content-['*'] after:ml-0.5 after:text-red-500">
            Date
          </div>
          <div className="col-span-3">
            <DatePicker onSelect={handleDateSelect} />
          </div>
          <div className="col-span-1 after:content-['*'] after:ml-0.5 after:text-red-500">
            Price
          </div>
          <Input
            placeholder="Buy / Sell price"
            className={cn(
              "no-spinner col-span-2",
              (!selectedAsset.symbol || previousClose === "NaN") && "col-span-3"
            )}
            type="number"
            value={assetPrice}
            onChange={(e) => {
              handleAssetPrice(e.target.value);
            }}
          />
          {(!selectedAsset.symbol || previousClose === "NaN") && (
            <>
              <div className="col-span-1 after:content-['*'] after:ml-0.5 after:text-red-500">
                Current price
              </div>
              <Input
                placeholder="Current unit price"
                className="no-spinner col-span-2"
                type="number"
                value={currentPrice}
                onChange={(e) => {
                  setCurrentPrice(e.target.value);
                }}
              />
            </>
          )}
          <div className="col-span-1">
            <Select
              onValueChange={(value) => {
                setCurrency(value);
              }}
              defaultValue={selectedAsset.currency.toUpperCase()}
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
          </div>
          <div className="col-span-2 col-start-3">
            <div className="flex gap-2">
              <Button
                className="w-full"
                onClick={() =>
                  handleAddAssets(
                    selectedAsset.instrument_name,
                    selectedAsset.symbol,
                    selectedAsset.instrument_type,
                    selectedAsset.exchange
                  )
                }
                disabled={buying}
              >
                {buying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Buy
              </Button>
              <Button
                className="w-full"
                onClick={() => handleSellAssets(selectedAsset.instrument_name)}
                disabled={selling}
              >
                {selling && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sell
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionForm;
