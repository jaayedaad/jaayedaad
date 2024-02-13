"use client";

import { Asset, getAssets } from "@/actions/getAssetsAction";
import { getHistoricalData } from "@/actions/getHistoricalData";
import React, { createContext, useContext, useEffect, useState } from "react";

export const DataContext = createContext<{
  assets: Asset[] | undefined;
  setAssets: React.Dispatch<React.SetStateAction<Asset[] | undefined>>;
  historicalData: any[] | undefined;
  setHistoricalData: React.Dispatch<React.SetStateAction<any[] | undefined>>;
  updateData: () => void;
} | null>(null);

export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [historicalData, setHistoricalData] = useState<any[]>();
  const [assets, setAssets] = useState<Asset[]>();

  const fetchData = async () => {
    const assets = await getAssets();
    setAssets(assets);
    if (assets) {
      const data = await getHistoricalData(assets);
      setHistoricalData(data.reverse());
    }
  };

  const updateData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        assets,
        setAssets,
        historicalData,
        setHistoricalData,
        updateData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("Data Error");
  }
  return context;
}
