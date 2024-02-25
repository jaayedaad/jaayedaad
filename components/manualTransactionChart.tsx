"use client";
import { Asset } from "@/actions/getAssetsAction";
import { useVisibility } from "@/contexts/visibility-context";
import { formatIndianNumber } from "@/helper/indianNumberingFormatter";
import { prepareHistoricalDataForManualCategory } from "@/helper/manualAssetsHistoryMaker";
import { IndianRupee } from "lucide-react";
import React, { useState } from "react";
import { Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts";
import ChangeInterval, { Interval } from "./changeInterval";
import { prepareLineChartData } from "@/helper/prepareLineChartData";
import { accumulateLineChartData } from "@/helper/lineChartDataAccumulator";

interface ManualTransactionChartProps {
  manualCategoryAssets: Asset[];
}

function ManualTransactionChart({
  manualCategoryAssets,
}: ManualTransactionChartProps) {
  const { visible } = useVisibility();
  const [dataToShow, setDataToShow] = useState<
    {
      name: string;
      amt: number;
    }[]
  >();

  const historicalData =
    prepareHistoricalDataForManualCategory(manualCategoryAssets);

  const lineChartData = accumulateLineChartData(historicalData);

  const seen: Record<string, boolean> = {};
  const uniqueData = lineChartData.filter((item) => {
    if (!seen[item.name]) {
      seen[item.name] = true;
      return true;
    }
    return false;
  });

  uniqueData.sort(
    (a, b) => new Date(b.name).getTime() - new Date(a.name).getTime()
  );

  function onChange(value: Interval) {
    prepareLineChartData(value, uniqueData, setDataToShow);
  }

  return (
    <div>
      <div className="flex gap-64">
        <div>
          <h3 className="font-semibold">Portfolio Performance</h3>
          <p className="text-muted-foreground text-sm">
            Insight into your portfolio&apos;s value dynamics
          </p>
        </div>
        <ChangeInterval onChange={onChange} />
      </div>
      <div className="flex justify-center mt-2">
        {dataToShow && dataToShow.length > 0 && (
          <AreaChart
            width={720}
            height={160}
            data={dataToShow}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`${
                    dataToShow[0].amt > dataToShow[dataToShow.length - 1].amt
                      ? "#ef4444"
                      : "#22c55e"
                  }`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`${
                    dataToShow[0].amt > dataToShow[dataToShow.length - 1].amt
                      ? "#ef4444"
                      : "#22c55e"
                  }`}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              angle={-30}
              minTickGap={10}
              padding={{ left: 30 }}
            />
            <YAxis
              domain={["dataMin - 10000", "dataMax + 10000"]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(tick) =>
                visible ? formatIndianNumber(tick) : "**"
              }
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value?.toString();
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-muted-foreground flex items-center">
                          <IndianRupee className="h-4 w-4" />
                          {visible
                            ? parseFloat(
                                parseFloat(value!).toFixed(2)
                              ).toLocaleString("en-IN")
                            : "* ".repeat(5)}
                        </span>
                      </div>
                    </div>
                  );
                }

                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="amt"
              stroke={`${
                dataToShow[0].amt > dataToShow[dataToShow.length - 1].amt
                  ? "#ef4444"
                  : "#22c55e"
              }`}
              fill="url(#colorUv)"
            />
          </AreaChart>
        )}
      </div>
    </div>
  );
}

export default ManualTransactionChart;
