"use client";
import { TAsset, TConversionRates, TInterval } from "@/types/types";
import {
  formatIndianNumber,
  formatInternationalNumber,
} from "@/helper/indianNumberingFormatter";
import { prepareHistoricalDataForManualCategory } from "@/helper/manualAssetsHistoryMaker";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ManualTransactionChartProps {
  timeInterval?: TInterval | undefined;
  dashboardAmountVisibility: boolean;
  numberSystem: string;
  defaultCurrency: string;
  chartData: {
    interval: string;
    data: {
      name: string;
      amt: number;
    }[];
  }[];
}

function ManualTransactionChart({
  timeInterval,
  chartData,
  dashboardAmountVisibility,
  numberSystem,
  defaultCurrency,
}: ManualTransactionChartProps) {
  const formatter = new Intl.NumberFormat(
    numberSystem === "Indian" ? "en-IN" : "en-US",
    {
      style: "currency",
      currency: defaultCurrency || "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
  const [dataToShow, setDataToShow] = useState<
    {
      name: string;
      amt: number;
    }[]
  >(chartData.filter((data) => data.interval === "All")[0].data);

  // const lineChartData = accumulateLineChartData(historicalData);

  // const seen: Record<string, boolean> = {};
  // const uniqueData = lineChartData.filter((item) => {
  //   if (!seen[item.name]) {
  //     seen[item.name] = true;
  //     return true;
  //   }
  //   return false;
  // });

  // uniqueData.sort(
  //   (a, b) => new Date(b.name).getTime() - new Date(a.name).getTime()
  // );

  useEffect(() => {
    timeInterval &&
      setDataToShow(
        chartData.filter((data) => data.interval === timeInterval)[0].data
      );
    // prepareLineChartData(timeInterval, uniqueData, setDataToShow);
  }, [timeInterval, chartData]);

  return (
    <div className="h-full">
      <div className="flex gap-64">
        <div>
          <h3 className="font-semibold">Portfolio Performance</h3>
          <p className="text-muted-foreground text-sm">
            Insight into your portfolio&apos;s value dynamics
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-2 h-full">
        {dataToShow && dataToShow.length > 0 && (
          <ResponsiveContainer width="100%" height="75%">
            <AreaChart
              width={720}
              height={200}
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
                domain={[
                  (dataMin: number) => Math.max(0, dataMin - dataMin / 10),
                  (dataMax: number) => dataMax + dataMax / 10,
                ]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(tick) =>
                  dashboardAmountVisibility
                    ? numberSystem === "Indian"
                      ? formatIndianNumber(tick)
                      : formatInternationalNumber(tick)
                    : "**"
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
                            {dashboardAmountVisibility
                              ? formatter.format(parseFloat(value!))
                              : "* ".repeat(5)}
                          </span>
                          <span>{payload[0].payload.name}</span>
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
                strokeWidth={2}
                stroke={`${
                  dataToShow[0].amt > dataToShow[dataToShow.length - 1].amt
                    ? "#ef4444"
                    : "#22c55e"
                }`}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ManualTransactionChart;
