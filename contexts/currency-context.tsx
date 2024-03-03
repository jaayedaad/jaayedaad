"use client";

import { getConversionRate } from "@/actions/getConversionRateAction";
import { getPreferences } from "@/actions/getPreferencesAction";
import { createContext, useContext, useEffect, useState } from "react";

export const CurrencyContext = createContext<
  | {
      defaultCurrency: string;
      setGlobalCurrency: React.Dispatch<React.SetStateAction<string>>;
      conversionRates:
        | {
            [currency: string]: number;
          }
        | undefined;
    }
  | undefined
>(undefined);

export default function CurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [defaultCurrency, setGlobalCurrency] = useState("");
  const [conversionRates, setConversionRates] = useState<{
    [currency: string]: number;
  }>();
  useEffect(() => {
    getConversionRate().then((rate) => setConversionRates(rate));
    getPreferences().then((preferences) =>
      setGlobalCurrency(preferences.defaultCurrency.toLowerCase())
    );
  }, [defaultCurrency]);
  return (
    <CurrencyContext.Provider
      value={{ defaultCurrency, setGlobalCurrency, conversionRates }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
