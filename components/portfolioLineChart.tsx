import React, { useState } from "react";
import { Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts";
import ChangeInterval, { Interval } from "./changeInterval";
import { IndianRupee } from "lucide-react";
import { prepareLineChartData } from "@/helper/lineChartDataAccumulator";

interface FilterMap {
  [key: string]: () => { name: string; amt: number }[];
}

function PortfolioLineChart({ data, view }: { data: any[]; view: string }) {
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
    dashboard: () => prepareLineChartData(data),
    stocks: () =>
      prepareLineChartData(data.filter((item) => item.assetType === "EQUITY")),
    crypto: () =>
      prepareLineChartData(
        data.filter((item) => item.assetType === "CRYPTOCURRENCY")
      ),
    funds: () =>
      prepareLineChartData(
        data.filter((item) => item.assetType === "MUTUALFUND")
      ),
  };

  if (filterMap.hasOwnProperty(view)) {
    accumulatedData = filterMap[view]();
  } else {
    // Handle case where view is not recognized
  }

  function prepareData(timeRange: Interval) {
    // Calculate start and end dates based on the selected time range
    const today = new Date(accumulatedData[0].name);

    let startDate: Date, endDate: Date;
    if (timeRange === "1d") {
      startDate = new Date(accumulatedData[1].name);
      startDate.setDate(startDate.getDate());
      endDate = today;
    } else if (timeRange === "1w") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      endDate = today;
    } else if (timeRange === "1m") {
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
      endDate = today;
    } else if (timeRange === "1y") {
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
      endDate = today;
    }

    // Fetch data based on the calculated start and end dates
    const fetchedData = accumulatedData.filter((item) => {
      const itemDate = new Date(item.name);
      return itemDate >= startDate && itemDate <= endDate;
    });

    setDataToShow(fetchedData.reverse());
  }

  // Handle change in interval
  function onChange(value: Interval) {
    prepareData(value);
  }

  return (
    <>
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
        {dataToShow && (
          <AreaChart
            width={720}
            height={160}
            data={dataToShow}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1d4fd8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1d4fd8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              padding={{ left: 16, right: 16 }}
            />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Value
                          </span>
                          <span className="font-bold text-muted-foreground flex items-center">
                            <IndianRupee className="h-4 w-4" />
                            {parseFloat(payload[0].value?.toString()!).toFixed(
                              2
                            )}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Date
                          </span>
                          <span className="font-bold text-muted-foreground flex items-center">
                            {payload[0].payload.name}
                          </span>
                        </div>
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
              stroke="#1d4fd8"
              fill="url(#colorUv)"
            />
          </AreaChart>
        )}
      </div>
    </>
  );
}

export default PortfolioLineChart;
