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
import { useData } from "@/contexts/data-context";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/currency-context";

interface transactionFormPropsType {
  selectedAsset: {
    instrument_name: string;
    symbol: string;
    prevClose?: string;
    instrument_type: string;
    exchange: string;
  };
  modalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function TransactionForm({
  selectedAsset,
  modalOpen,
}: transactionFormPropsType) {
  const { updateData } = useData();
  const { defaultCurrency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [assetQuantity, setAssetQuantity] = useState<string>("");
  const [assetPrice, setAssetPrice] = useState(selectedAsset?.prevClose);
  const [date, setDate] = useState<string>("");
  const [currency, setCurrency] = useState(defaultCurrency.toUpperCase());
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
    modalOpen(false);
    toast.success("Asset added successfully");
    setAssetQuantity("");
    setAssetPrice("");
    setDate("");
    setCurrency(defaultCurrency.toUpperCase());
    updateData();
  };

  // Sell assets handler
  const handleSellAssets = async (instrument_name: string) => {
    setLoading(true);
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
          setLoading(false);
          modalOpen(false);
          toast.error(data.error);
          setAssetQuantity("");
          setAssetPrice("");
          setDate("");
          setCurrency(defaultCurrency.toUpperCase());
        }
        if (data.success) {
          setLoading(false);
          modalOpen(false);
          toast.success(data.success);
          setAssetQuantity("");
          setAssetPrice("");
          setDate("");
          setCurrency(defaultCurrency.toUpperCase());
          updateData();
        }
      });
  };

  const handleAssetQuantiy = (value: string) => {
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
        <div className="grid grid-cols-4 py-4 gap-4">
          <div className="text-base col-span-1">Quantity</div>
          <Input
            placeholder="Quantity"
            className="col-span-3 no-spinner"
            type="number"
            value={assetQuantity}
            onChange={(e) => {
              handleAssetQuantiy(e.target.value);
            }}
          />
          <div className="col-span-1 text-base">Date</div>
          <div className="col-span-3">
            <DatePicker onSelect={handleDateSelect} />
          </div>
          <div className="col-span-1">Price</div>
          <Input
            placeholder="Buy / Sell price"
            className="no-spinner col-span-2"
            type="number"
            value={assetPrice}
            onChange={(e) => {
              handleAssetPrice(e.target.value);
            }}
          />
          <div className="col-span-1">
            <Select
              onValueChange={(value) => {
                setCurrency(value);
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
                disabled={loading}
              >
                Buy
              </Button>
              <Button
                className="w-full"
                onClick={() => handleSellAssets(selectedAsset.instrument_name)}
                disabled={loading}
              >
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
