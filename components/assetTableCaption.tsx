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
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/helper";
import { TPreference } from "@/lib/types";
import { updatePreferenceAction } from "@/app/(protected)/dashboard/settings/actions";
import { toast } from "sonner";

function AssetTableCaption({ preferences }: { preferences: TPreference }) {
  const [open, setOpen] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState<string>(
    preferences.defaultCurrency
  );
  const [loading, setLoading] = useState(false);

  const handleUpdateCurrency = async () => {
    if (defaultCurrency) {
      try {
        setLoading(true);
        const updated = await updatePreferenceAction({ defaultCurrency });
        if (!updated) {
          throw new Error();
        }
      } catch {
        toast.error("Failed to update default currency");
      } finally {
        setOpen(false);
        setLoading(false);
      }
    }
  };
  return (
    defaultCurrency && (
      <TableCaption className="mt-0 text-right xl:text-sm lg:text-xs">
        *All values are in
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button
              variant="link"
              className="xl:text-sm lg:text-xs ml-1 p-0 underline text-muted-foreground"
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
            <div className="grid grid-cols-5 grid-rows-2 gap-1">
              {currencies.slice(0, 9).map((currency) => {
                return (
                  <Button
                    className={cn(
                      "text-muted-foreground",
                      defaultCurrency.toUpperCase() === currency.label &&
                        "bg-secondary hover:bg-primary/20 text-primary"
                    )}
                    onClick={() => setDefaultCurrency(currency.label)}
                    variant="ghost"
                    key={currency.label}
                  >
                    {currency.label}
                  </Button>
                );
              })}

              <Select
                onValueChange={(value) => {
                  setDefaultCurrency(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="More" />
                </SelectTrigger>
                <SelectContent className="h-72">
                  {currencies.slice(9).map((currency) => {
                    return (
                      <SelectItem key={currency.label} value={currency.label}>
                        {currency.value}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="inline-flex justify-end">
              <Button onClick={() => handleUpdateCurrency()}>
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
