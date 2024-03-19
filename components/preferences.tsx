"use client";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
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

interface PreferenceProps {
  preferences: Preference;
  setPreferences: React.Dispatch<
    React.SetStateAction<
      | {
          id: string;
          publicProfile: boolean;
          defaultCurrency: string;
          numberSystem: string;
          showHoldings: boolean;
          showMetrics: boolean;
          userId: string;
        }
      | undefined
    >
  >;
}

function Preferences({ preferences, setPreferences }: PreferenceProps) {
  const { setNumberSystem, setGlobalCurrency } = useCurrency();
  const [publicProfile, setPublicProfile] = useState(preferences.publicProfile);
  const [defaultCurrency, setDefaultCurrency] = useState(
    preferences.defaultCurrency
  );
  const [defaultNumberSystem, setDefaultNumberSystem] = useState(
    preferences.numberSystem
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedPreferences = {
        ...preferences,
        publicProfile: publicProfile,
        defaultCurrency: defaultCurrency,
        numberSystem: defaultNumberSystem,
      };
      await fetch("/api/user/preferences", {
        method: "POST",
        body: JSON.stringify(updatedPreferences),
      });
    } finally {
      setPreferences({
        ...preferences,
        publicProfile: publicProfile,
        defaultCurrency: defaultCurrency,
        numberSystem: defaultNumberSystem,
      });
      setNumberSystem(defaultNumberSystem);
      setGlobalCurrency(defaultCurrency);
      setLoading(false);
      toast.success("Preferences updated successfully!");
    }
  };
  return (
    <>
      <div className="flex justify-between">
        <div className="mb-4">
          <h2 className="text-3xl font-bold">Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Configure your preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
      <Separator className="my-4" />
      {preferences ? (
        <div className="flex flex-col gap-4">
          <div className="py-5 px-4 flex items-center justify-between border rounded-md w-full">
            <div>
              <h2>Public profile</h2>
              <p className="text-muted-foreground text-sm">
                Toggle your public profile visibility
              </p>
            </div>
            <Switch
              checked={publicProfile}
              onCheckedChange={(value) => setPublicProfile(value)}
            />
          </div>
          <div className="py-5 px-4 flex items-center justify-between border rounded-md w-full">
            <div>
              <h2>Default currency</h2>
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
              <h2>Default numbering system</h2>
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
