"use client";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { currencies } from "@/constants/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { numberSystem } from "@/constants/numberSystems";
import { useCurrency } from "@/contexts/currency-context";
import { toast } from "sonner";
import LoadingSpinner from "./ui/loading-spinner";
import { Preference } from "@prisma/client";
import { performanceBarOrder } from "@/constants/performanceBarOrder";
import { Toggle } from "./ui/toggle";
import { useVisibility } from "@/contexts/visibility-context";

interface PreferenceProps {
  preferences: Preference;
  setPreferences: React.Dispatch<React.SetStateAction<Preference | undefined>>;
}

function Preferences({ preferences, setPreferences }: PreferenceProps) {
  const { visible, setVisible } = useVisibility();
  const { setNumberSystem, setGlobalCurrency, setPerformanceBarOrder } =
    useCurrency();
  const [defaultCurrency, setDefaultCurrency] = useState(
    preferences.defaultCurrency
  );
  const [defaultNumberSystem, setDefaultNumberSystem] = useState(
    preferences.numberSystem
  );
  const [defaultPerformanceBarOrder, setDefaultPerformanceBarOrder] = useState(
    preferences.performanceBarOrder
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedPreferences = {
        ...preferences,
        defaultCurrency: defaultCurrency,
        numberSystem: defaultNumberSystem,
        performanceBarOrder: defaultPerformanceBarOrder,
      };
      await fetch("/api/user/preferences", {
        method: "POST",
        body: JSON.stringify(updatedPreferences),
      });
    } finally {
      setPreferences({
        ...preferences,
        defaultCurrency: defaultCurrency,
        numberSystem: defaultNumberSystem,
        performanceBarOrder: defaultPerformanceBarOrder,
      });
      setNumberSystem(defaultNumberSystem);
      setGlobalCurrency(defaultCurrency);
      setPerformanceBarOrder(defaultPerformanceBarOrder);
      setLoading(false);
      toast.success("Preferences updated successfully!");
    }
  };
  return (
    <>
      <div className="flex justify-between">
        <div>
          <h2 className="text-3xl text-foreground font-bold">Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Configure your preferences
          </p>
        </div>
        {/* <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button> */}
      </div>
      <Separator />
      {preferences ? (
        <div className="flex flex-col gap-4">
          <div className="py-5 px-4 flex items-center justify-between border rounded-md w-full">
            <div>
              <h2 className="text-foreground">Default currency</h2>
              <p className="text-muted-foreground text-sm">
                Set your default currency
              </p>
            </div>
            <div>
              <Select
                onValueChange={(value) => {
                  setDefaultCurrency(value);
                }}
                value={defaultCurrency}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
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
          </div>
          <div className="py-5 px-4 flex items-center justify-between border rounded-md w-full">
            <div>
              <h2 className="text-foreground">Default numbering system</h2>
              <p className="text-muted-foreground text-sm">
                Set your default numbering system
              </p>
            </div>
            <div>
              <Select
                onValueChange={(value) => {
                  setDefaultNumberSystem(value);
                }}
                value={defaultNumberSystem}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {numberSystem.map((system) => {
                    return (
                      <SelectItem key={system.label} value={system.label}>
                        {system.value}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="py-5 px-4 flex items-center justify-between border rounded-md w-full">
            <div>
              <h2 className="text-foreground">Asset performance bar</h2>
              <p className="text-muted-foreground text-sm">
                Set the order of asset performance bar
              </p>
            </div>
            <div>
              <Select
                onValueChange={(value) => {
                  setDefaultPerformanceBarOrder(value);
                }}
                value={defaultPerformanceBarOrder}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {performanceBarOrder.map((order) => {
                    return (
                      <SelectItem key={order.label} value={order.label}>
                        {order.value}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="py-5 px-4 flex items-center justify-between border rounded-md w-full">
            <div>
              <h2 className="text-foreground">Mode toggle</h2>
              <p className="text-muted-foreground text-sm">
                Toggle visibility of your asset&apos;s values
              </p>
            </div>
            <div>
              <Toggle onPressedChange={() => setVisible(!visible)}>
                {visible ? (
                  <EyeIcon className="h-4 w-4" />
                ) : (
                  <EyeOffIcon className="h-4 w-4" />
                )}
              </Toggle>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-48">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}

export default Preferences;
