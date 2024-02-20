import React, { useState } from "react";
import { Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts";
import ChangeInterval, { Interval } from "./changeInterval";
import { IndianRupee } from "lucide-react";
import { accumulateLineChartData } from "@/helper/lineChartDataAccumulator";
import { useVisibility } from "@/contexts/visibility-context";
import { formatIndianNumber } from "@/helper/indianNumberingFormatter";
import { prepareLineChartData } from "@/helper/prepareLineChartData";

interface FilterMap {
  [key: string]: () => { name: string; amt: number }[];
}

function PortfolioLineChart({ data, view }: { data: any[]; view: string }) {
  const { visible } = useVisibility();
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
    stocks: () =>
      accumulateLineChartData(
        data.filter((item) => item.assetType === "EQUITY")
      ),
    crypto: () =>
      accumulateLineChartData(
        data.filter((item) => item.assetType === "CRYPTOCURRENCY")
      ),
    funds: () =>
      accumulateLineChartData(
        data.filter((item) => item.assetType === "MUTUALFUND")
      ),
  };

  if (filterMap.hasOwnProperty(view)) {
    accumulatedData = filterMap[view]();
  } else {
    // Handle case where view is not recognized
  }

  // Handle change in interval
  function onChange(value: Interval) {
    prepareLineChartData(value, accumulatedData, setDataToShow);
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
              left: 0,
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
              angle={-30}
              minTickGap={10}
              padding={{ left: 30 }}
            />
            <YAxis
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
