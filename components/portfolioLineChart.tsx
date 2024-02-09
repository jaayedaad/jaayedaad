import React from "react";
import { Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Feb 1",
    uv: 4000,
    amt: 2400,
  },
  {
    name: "Feb 2",
    uv: 3000,
    amt: 2210,
  },
  {
    name: "Feb 3",
    uv: 2000,
    amt: 2290,
  },
  {
    name: "Feb 4",
    uv: 2780,
    amt: 2000,
  },
  {
    name: "Feb 5",
    uv: 1890,
    amt: 2181,
  },
  {
    name: "Feb 6",
    uv: 2390,
    amt: 2500,
  },
  {
    name: "Feb 7",
    uv: 3490,
    amt: 2100,
  },
];

function PortfolioLineChart() {
  return (
    <>
      <h3 className="font-semibold">Portfolio Performance</h3>
      <p className="text-muted-foreground text-sm">
        Insight into your portfolio&apos;s value dynamics
      </p>
      <div className="flex justify-center mt-6">
        <AreaChart
          width={720}
          height={160}
          data={data}
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
                          Average
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].value}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Today
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
            dataKey="uv"
            stroke="#1d4fd8"
            fill="url(#colorUv)"
          />
        </AreaChart>
      </div>
    </>
  );
}

export default PortfolioLineChart;
