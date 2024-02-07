"use client";
import { Asset } from "@/actions/getAssetsAction";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { calculateHistoricalChanges } from "@/helper/historicalChangesCalculator";
import ChangeInterval, { Interval } from "@/components/changeInterval";

function ProfileOverview({ assets }: { assets: Asset[] }) {
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState<Interval>("1d");
  const [data, setData] = useState<{
    oneDayChanges: number[];
    oneWeekChanges: number[];
    oneMonthChanges: number[];
    oneYearChanges: number[];
  }>();

  // Get historical data for all assets
  useEffect(() => {
    async function getHistoricalData(assets: Asset[]) {
      let historicalData = [];
      for (const asset of assets) {
        const { symbol } = asset;
        const res = await fetch(
          `https://yh-finance.p.rapidapi.com/stock/v3/get-historical-data?symbol=${symbol}`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": process.env.NEXT_PUBLIC_YHFINANCE_KEY,
              "X-RapidAPI-Host": "yh-finance.p.rapidapi.com",
            },
          }
        );
        const data = await res.json();
        if (data) {
          historicalData.push(data);
        }
      }
      return historicalData;
    }
    getHistoricalData(assets).then((data) => {
      setLoading(false);
      const historicalData = calculateHistoricalChanges(data);

      function updateChanges(
        changesArray: number[],
        assetsArray: Asset[],
        type: string
      ) {
        assetsArray.forEach((asset) => {
          const index = assetsArray.indexOf(asset);
          if (index !== -1) {
            if (type == "day") {
              changesArray[index] -= parseFloat(asset.prevClose);
            } else {
              changesArray[index] =
                historicalData.oneDayChanges[index] - changesArray[index];
            }
          }
        });
      }

      // Update changes for each time period
      updateChanges(historicalData.oneWeekChanges, assets, "week");
      updateChanges(historicalData.oneMonthChanges, assets, "month");
      updateChanges(historicalData.oneYearChanges, assets, "year");
      updateChanges(historicalData.oneDayChanges, assets, "day");

      setData(historicalData);
    });
  });

  function handleIntervalChange(interval: Interval) {
    setInterval(interval);
  }

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div>
      Profile Overview
      <div>
        <ChangeInterval onChange={handleIntervalChange} />
      </div>
    </div>
  );
}

export default ProfileOverview;
