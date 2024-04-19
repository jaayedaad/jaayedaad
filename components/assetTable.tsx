"use client";
import {
  TAsset,
  TConversionRates,
  THistoricalData,
  TPreference,
  TProfitLoss,
  TUnrealisedProfitLoss,
} from "@/types/types";
import { useState } from "react";
import ViewAsset from "./viewAsset";
import { getAssetTableColumns } from "./dashboard/assets/columns";
import { getManualAssetTableColumns } from "./dashboard/manualAssets/columns";
import { AssetDataTable } from "./dashboard/assets/assetsTable";
import { ManualAssetDataTable } from "./dashboard/manualAssets/manualAssetsTable";

interface AssetTableProps {
  data: TAsset[];
  historicalData?: THistoricalData[];
  isPublic?: boolean;
  unrealisedResults?: TUnrealisedProfitLoss[];
  realisedResults?: TProfitLoss[];
  lineChartData: {
    interval: string;
    data: {
      name: string;
      amt: number;
    }[];
  }[];
  conversionRates: TConversionRates;
  preferences: TPreference;
}

function AssetTable({
  data,
  historicalData,
  unrealisedResults,
  realisedResults,
  lineChartData,
  conversionRates,
  preferences,
}: AssetTableProps) {
  const [open, setOpen] = useState(false);
  const [assetToView, setAssetToView] = useState<TAsset>();
  const [manualAsset, setManualAsset] = useState<TAsset>();

  return (
    data.length > 0 && (
      <>
        {data && data.some((asset) => asset.symbol === null) ? (
          <ManualAssetDataTable
            columns={getManualAssetTableColumns(
              preferences.dashboardAmountVisibility,
              conversionRates
            )}
            data={data}
            conversionRates={conversionRates}
            setManualAsset={setManualAsset}
            setOpen={setOpen}
          />
        ) : (
          <AssetDataTable
            columns={getAssetTableColumns(
              preferences.dashboardAmountVisibility,
              conversionRates
            )}
            data={data}
            conversionRates={conversionRates}
            setAssetToView={setAssetToView}
            setManualAsset={setManualAsset}
            setOpen={setOpen}
          />
        )}
        {historicalData &&
          open &&
          conversionRates &&
          unrealisedResults &&
          realisedResults && (
            <ViewAsset
              open={open}
              setOpen={setOpen}
              assetToView={assetToView}
              manualAsset={manualAsset}
              chartData={lineChartData}
              unrealisedResults={unrealisedResults}
              realisedResults={realisedResults}
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
