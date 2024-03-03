"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableCaption } from "./ui/table";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { currencies } from "@/constants/currency";
import { getPreferences } from "@/actions/getPreferencesAction";
import { Preference } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

function AssetTableCaption() {
  const { setGlobalCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPreferences().then((preferences: Preference) => {
      setDefaultCurrency(preferences.defaultCurrency);
    });
  }, []);

  const hadnleConfirmCurrency = async () => {
    if (defaultCurrency) {
      try {
        setLoading(true);
        const preferences = {
          defaultCurrency: defaultCurrency,
        };
        await fetch("/api/user/preferences", {
          method: "POST",
          body: JSON.stringify(preferences),
        });
      } finally {
        setGlobalCurrency(defaultCurrency);
        setOpen(false);
        setLoading(false);
      }
    }
  };
  return (
    defaultCurrency && (
      <TableCaption className="text-right">
        *All values are in{" "}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button
              variant="link"
              className="text-sm p-0 underline text-muted-foreground"
            >
              {defaultCurrency}.
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Default currency</DialogTitle>
              <DialogDescription>
                Set the default currency of your choice
              </DialogDescription>
            </DialogHeader>
            <Select
              onValueChange={(value) => {
                setDefaultCurrency(value);
              }}
              value={defaultCurrency}
            >
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="h-72">
                {currencies.map((currency) => {
                  return (
                    <SelectItem key={currency.label} value={currency.label}>
                      {currency.value}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <div className="inline-flex justify-end">
              <Button onClick={() => hadnleConfirmCurrency()}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TableCaption>
    )
  );
}

export default AssetTableCaption;
