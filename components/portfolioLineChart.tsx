"use client";

import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { accumulateLineChartData } from "@/helper/lineChartDataAccumulator";
import {
  formatIndianNumber,
  formatInternationalNumber,
} from "@/helper/indianNumberingFormatter";
import { prepareLineChartData } from "@/helper/prepareLineChartData";
import { TInterval } from "@/lib/types";

interface FilterMap {
  [key: string]: () => { name: string; amt: number }[];
}

function PortfolioLineChart({
  data,
  view,
  timeInterval,
  dashboardAmountVisibility,
  numberSystem,
  defaultCurrency,
}: {
  data: any[];
  view: string;
  timeInterval?: TInterval;
  dashboardAmountVisibility: boolean;
  numberSystem: string;
  defaultCurrency: string;
}) {
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
  >();

  let accumulatedData: {
    name: string;
    amt: number;
  }[];

  const filterMap: FilterMap = {
    dashboard: () => accumulateLineChartData(data),
    "common stock": () =>
      accumulateLineChartData(
        data.filter((item) => item.assetType === "Common Stock")
      ),
    "digital currency": () =>
      accumulateLineChartData(
        data.filter((item) => item.assetType === "Digital Currency")
      ),
    "mutual funds": () =>
      accumulateLineChartData(
        data.filter((item) => item.assetType === "Mutual Fund")
      ),
  };
  if (filterMap.hasOwnProperty(view)) {
    accumulatedData = filterMap[view]();
  } else {
    // Handle case where view is not recognized
  }

  useEffect(() => {
    timeInterval &&
      prepareLineChartData(timeInterval, accumulatedData, setDataToShow);
  }, [timeInterval]);
  return (
    <>
      <div className="flex gap-64">
        <div>
          <h3 className="font-semibold">Portfolio Performance</h3>
          <p className="text-muted-foreground text-xs xl:text-sm">
            Insight into your portfolio&apos;s value dynamics
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-2 h-full">
        {dataToShow && (
          <ResponsiveContainer width="100%" height="75%">
            <AreaChart
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
                  (dataMin: any) => Math.max(0, dataMin - dataMin / 20),
                  (dataMax: any) => dataMax + dataMax / 20,
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
    </>
  );
}

export default PortfolioLineChart;
