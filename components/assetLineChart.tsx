import { formatIndianNumber } from "@/helper/indianNumberingFormatter";
import { IndianRupee } from "lucide-react";
import React from "react";
import { Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts";

function AssetLineChart({
  dataToShow,
}: {
  dataToShow: {
    name: string;
    amt: number;
  }[];
}) {
  return (
    <AreaChart
      width={670}
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
        tickFormatter={(tick) => formatIndianNumber(tick)}
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
                    {parseFloat(parseFloat(value!).toFixed(2)).toLocaleString(
                      "en-IN"
                    )}
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
  );
}

export default AssetLineChart;
