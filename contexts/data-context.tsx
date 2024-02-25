"use client";

import { Asset as detailedAsset, getAssets } from "@/actions/getAssetsAction";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { getHistoricalData } from "@/actions/getHistoricalData";
import { Asset } from "@prisma/client";
import React, { createContext, useContext, useEffect, useState } from "react";

export const DataContext = createContext<{
  assets: detailedAsset[] | undefined;
  historicalData: any[] | undefined;
  user:
    | {
        usersManualCategories: {
          id: string;
          name: string;
          userId: string;
          assets: Asset[] | undefined;
        }[];
        userData: {
          id: string;
          name: string | null;
          username: string | null;
          email: string;
          emailVerified: Date | null;
          image: string | null;
        };
      }
    | undefined;
  updateData: () => void;
} | null>(null);

export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [historicalData, setHistoricalData] = useState<any[]>();
  const [assets, setAssets] = useState<detailedAsset[]>();
  const [user, setUser] = useState<{
    usersManualCategories: {
      id: string;
      name: string;
      userId: string;
      assets: Asset[] | undefined;
    }[];
    userData: {
      id: string;
      name: string | null;
      username: string | null;
      email: string;
      emailVerified: Date | null;
      image: string | null;
    };
  }>();

  const fetchData = async () => {
    const userResponse = await getCurrentUser();
    if (userResponse) {
      setUser(userResponse);
    }
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
        historicalData,
        user,
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
