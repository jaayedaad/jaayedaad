"use client";
import { TAsset, TConversionRates, TInterval, TPreference } from "@/lib/types";
import { useEffect, useState } from "react";
import ViewAsset from "./viewAsset";
import { getDashboardTableColumns } from "./dashboard/columns";
import { getAssetTableColumns } from "./dashboard/assets/columns";
import { getManualAssetTableColumns } from "./dashboard/manualAssets/columns";
import { DashboardTable } from "./dashboard/dashboardTable";
import { AssetDataTable } from "./dashboard/assets/assetsTable";
import { ManualAssetDataTable } from "./dashboard/manualAssets/manualAssetsTable";
import { log } from "console";
import { useRouter } from "next/navigation";

interface AssetTableProps {
  data: TAsset[];
  view?: string; // "stocks" | "crypto" | "funds" | "property"
  historicalData?: any[];
  isPublic?: boolean;
  timelineInterval?: TInterval;
  intervalChangeData?: {
    category: string;
    symbol: string;
    compareValue: string;
    currentValue: string;
    valueAtInterval: number;
    prevClose: string;
    interval: string;
    unrealisedProfitLoss: string;
  }[];
  conversionRates: TConversionRates;
  preferences: TPreference;
}

function AssetTable({
  data,
  view,
  historicalData,
  timelineInterval,
  intervalChangeData,
  conversionRates,
  preferences,
}: AssetTableProps) {
  const { defaultCurrency } = preferences;
  const [open, setOpen] = useState(false);
  const [assetToView, setAssetToView] = useState<TAsset>();
  const [groupedAsset, setGroupedAsset] = useState<
    {
      category: string;
      currentValue: number;
      compareValue: number;
      valueAtInterval: number;
    }[]
  >();
  const [manualAsset, setManualAsset] = useState<TAsset>();
  const [filteredAsset, setFilteredAsset] = useState<TAsset[]>();

  const filters: Record<string, (asset: TAsset) => boolean> = {
    "common stock": (asset) => asset.category === "Common Stock",
    "digital currency": (asset) => asset.category === "Digital Currency",
    "mutual funds": (asset) => asset.category === "Mutual Fund",
  };

  useEffect(() => {
    async function fetchData() {
      if (view) {
        if (filters.hasOwnProperty(view)) {
          setFilteredAsset(data.filter(filters[view]));
        } else {
          const param = decodeURIComponent(view);
          setFilteredAsset(
            data?.filter(
              (asset) => asset.category.toUpperCase() === param.toUpperCase()
            )
          );
        }
      } else {
        let groupedAssets: {
          category: string;
          currentValue: number;
          compareValue: number;
          valueAtInterval: number;
        }[] = [];

        const intervalData = intervalChangeData?.filter(
          (data) => data.interval === timelineInterval
        );

        const intervalDataSumByType = intervalData?.reduce((acc: any, data) => {
          const { category, valueAtInterval } = data;
          acc[category] = (acc[category] || 0) + valueAtInterval;
          return acc;
        }, {});

        data.forEach((asset) => {
          if (asset.quantity !== "0" && intervalData) {
            const assetCurrency = asset.buyCurrency.toLowerCase();
            const currencyConversion = conversionRates[assetCurrency];
            const multiplier = 1 / currencyConversion;
            const existingType = groupedAssets.find(
              (data) => data.category === asset.category
            );

            if (existingType) {
              existingType.currentValue += asset.currentValue * multiplier;
              existingType.compareValue += asset.compareValue * multiplier;
              existingType.valueAtInterval += asset.valueAtInterval;
            } else {
              groupedAssets.push({
                category: asset.category,
                currentValue: asset.currentValue * multiplier,
                compareValue: asset.compareValue * multiplier,
                valueAtInterval: asset.valueAtInterval,
              });
            }
          }
        });
        if (intervalData && intervalData.length > 0) {
          groupedAssets = groupedAssets.map((asset) => ({
            ...asset,
            valueAtInterval:
              intervalDataSumByType[asset.category] !== undefined
                ? intervalDataSumByType[asset.category]
                : asset.valueAtInterval,
          }));
        }

        setGroupedAsset(groupedAssets);
        setFilteredAsset(data);
      }
    }
    fetchData();
  }, [data, timelineInterval, defaultCurrency]);

  return (
    filteredAsset &&
    filteredAsset.length > 0 && (
      <>
        {groupedAsset ? (
          <DashboardTable
            columns={getDashboardTableColumns(
              preferences.dashboardAmountVisibility
            )}
            data={groupedAsset}
          />
        ) : filteredAsset &&
          filteredAsset.some((asset) => asset.symbol === null) ? (
          <ManualAssetDataTable
            columns={getManualAssetTableColumns(
              preferences.dashboardAmountVisibility,
              conversionRates
            )}
            data={filteredAsset}
            setManualAsset={setManualAsset}
            setOpen={setOpen}
          />
        ) : (
          <AssetDataTable
            columns={getAssetTableColumns(
              preferences.dashboardAmountVisibility,
              conversionRates
            )}
            data={filteredAsset}
            setAssetToView={setAssetToView}
            setManualAsset={setManualAsset}
            setOpen={setOpen}
          />
        )}
        {historicalData && open && conversionRates && (
          <ViewAsset
            open={open}
            setOpen={setOpen}
            assetToView={assetToView}
            manualAsset={manualAsset}
            historicalData={historicalData}
            conversionRates={conversionRates}
            numberSystem={preferences.numberSystem}
            defaultCurrency={preferences.defaultCurrency}
          />
        )}
      </>
    )
  );
}

export default AssetTable;
