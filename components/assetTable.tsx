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
        }[] = [];

        const intervalData = intervalChangeData?.filter(
          (data) => data.interval === timelineInterval
        );

        const currentValueSumByType = intervalData?.reduce((acc: any, data) => {
          const { category, currentValue } = data;

          acc[category] = (acc[category] || 0) + parseFloat(currentValue);
          return acc;
        }, {});

        const compareValueSumByType = intervalData?.reduce((acc: any, data) => {
          const { category, compareValue } = data;
          acc[category] = (acc[category] || 0) + parseFloat(compareValue);
          return acc;
        }, {});

        data.forEach((asset) => {
          if (asset.quantity !== "0") {
            const assetCurrency = asset.buyCurrency.toLowerCase();
            const currencyConversion = conversionRates[assetCurrency];
            const multiplier = 1 / currencyConversion;
            const existingType = groupedAssets.find(
              (data) => data.category === asset.category
            );

            if (existingType) {
              existingType.currentValue += asset.currentValue * multiplier;
              existingType.compareValue += asset.compareValue * multiplier;
            } else {
              groupedAssets.push({
                category: asset.category,
                currentValue: asset.symbol
                  ? asset.currentValue * multiplier
                  : asset.currentValue * multiplier,
                compareValue: asset.compareValue * multiplier,
              });
            }
          }
        });
        if (intervalData && intervalData.length > 0) {
          groupedAssets = groupedAssets.map((asset) => ({
            ...asset,
            currentValue:
              currentValueSumByType[asset.category] !== undefined
                ? currentValueSumByType[asset.category]
                : asset.currentValue,
            compareValue:
              compareValueSumByType[asset.category] !== undefined
                ? compareValueSumByType[asset.category]
                : asset.compareValue,
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
