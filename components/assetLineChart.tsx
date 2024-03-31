import { useCurrency } from "@/contexts/currency-context";
import {
  formatIndianNumber,
  formatInternationalNumber,
} from "@/helper/indianNumberingFormatter";
import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function AssetLineChart({
  dataToShow,
}: {
  dataToShow: {
    name: string;
    amt: number;
  }[];
}) {
  const { numberSystem, defaultCurrency } = useCurrency();
  const formatter = new Intl.NumberFormat(
    numberSystem === "Indian" ? "en-IN" : "en-US",
    {
      style: "currency",
      currency: defaultCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
  return (
    <ResponsiveContainer height={200}>
      <AreaChart
        width={380}
        height={200}
        data={dataToShow}
        margin={{
          top: 20,
          right: 20,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorAv" x1="0" y1="0" x2="0" y2="1">
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
          padding={{ left: 10 }}
        />
        <YAxis
          type="number"
          domain={[
            (dataMin: any) => Math.max(0, dataMin - dataMin / 10),
            (dataMax: any) => dataMax + dataMax / 10,
          ]}
          tickLine={false}
          axisLine={false}
          tickFormatter={(tick) =>
            numberSystem === "Indian"
              ? formatIndianNumber(tick)
              : formatInternationalNumber(tick)
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
                      {formatter.format(parseFloat(value!))}
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
          strokeWidth={2}
          dot={{
            r: 4,
            style: { fill: "#ffffff" },
          }}
          stroke={`${
            dataToShow[0].amt > dataToShow[dataToShow.length - 1].amt
              ? "#ef4444"
              : "#22c55e"
          }`}
          fill="url(#colorAv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default AssetLineChart;
