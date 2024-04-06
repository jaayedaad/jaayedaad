"use client";

import { Separator } from "@/components/ui/separator";
import { useCallback, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { currencies } from "@/constants/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { numberSystem } from "@/constants/numberSystems";
import { toast } from "sonner";
import { performanceBarOrder } from "@/constants/performanceBarOrder";
import { Toggle } from "./ui/toggle";
import { TPreference } from "@/lib/types";
import { updatePreferenceAction } from "@/app/(protected)/dashboard/settings/actions";

interface PreferenceProps {
  preference: TPreference;
}

function PreferenceComponent({ preference: preferences }: PreferenceProps) {
  const [defaultCurrency, setDefaultCurrency] = useState(
    preferences.defaultCurrency
  );
  const [defaultNumberSystem, setDefaultNumberSystem] = useState(
    preferences.numberSystem
  );
  const [defaultPerformanceBarOrder, setDefaultPerformanceBarOrder] = useState(
    preferences.performanceBarOrder
  );

  const handleSave = async (preferenceToUpdate: Partial<TPreference>) => {
    try {
      await updatePreferenceAction(preferenceToUpdate);
      toast.success("Preferences updated successfully!");
    } catch {
      toast.error("An error occurred while updating preferences");
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
      </div>
      <Separator />

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
              onValueChange={async (value) => {
                setDefaultCurrency(value);
                await handleSave({ defaultCurrency: value });
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
              onValueChange={async (value) => {
                setDefaultNumberSystem(value);
                await handleSave({ numberSystem: value });
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
              onValueChange={async (value) => {
                setDefaultPerformanceBarOrder(value);
                await handleSave({ performanceBarOrder: value });
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
            <Toggle
              onPressedChange={async () =>
                await updatePreferenceAction({
                  dashboardAmountVisibility:
                    !preferences.dashboardAmountVisibility,
                })
              }
            >
              {preferences.dashboardAmountVisibility ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeOffIcon className="h-4 w-4" />
              )}
            </Toggle>
          </div>
        </div>
      </div>
    </>
  );
}

export default PreferenceComponent;
