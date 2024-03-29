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
      numberSystem: string;
      setNumberSystem: React.Dispatch<React.SetStateAction<string>>;
      performanceBarOrder: string;
      setPerformanceBarOrder: React.Dispatch<React.SetStateAction<string>>;
    }
  | undefined
>(undefined);

export default function CurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [defaultCurrency, setGlobalCurrency] = useState("");
  const [numberSystem, setNumberSystem] = useState("Indian");
  const [conversionRates, setConversionRates] = useState<{
    [currency: string]: number;
  }>();
  const [performanceBarOrder, setPerformanceBarOrder] = useState("Ascending");
  useEffect(() => {
    getConversionRate().then((rate) => setConversionRates(rate));
    getPreferences().then((preferences) => {
      setGlobalCurrency(preferences.defaultCurrency.toLowerCase());
      setNumberSystem(preferences.numberSystem);
      setPerformanceBarOrder(preferences.performanceBarOrder);
    });
  }, [defaultCurrency]);
  return (
    <CurrencyContext.Provider
      value={{
        defaultCurrency,
        setGlobalCurrency,
        conversionRates,
        numberSystem,
        setNumberSystem,
        performanceBarOrder,
        setPerformanceBarOrder,
      }}
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
