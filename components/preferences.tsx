"use client";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getPreferences } from "@/actions/getPreferencesAction";
import { Preference } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { currencies } from "@/constants/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function Preferences() {
  const [publicProfile, setPublicProfile] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState("INR");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPreferences().then((preferences: Preference) => {
      setPublicProfile(preferences.publicProfile);
      setDefaultCurrency(preferences.defaultCurrency);
    });
  }, []);

  console.log(defaultCurrency);

  const handleSave = async () => {
    try {
      setLoading(true);
      const preferences = {
        publicProfile: publicProfile,
        defaultCurrency: defaultCurrency,
      };
      await fetch("/api/user/preferences", {
        method: "POST",
        body: JSON.stringify(preferences),
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold mb-4">Preferences</h2>
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
      <Separator className="my-4" />
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
        </div>
      </div>
    </>
  );
}

export default Preferences;
