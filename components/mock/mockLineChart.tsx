import React from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

const dataToShow = [
  {
    name: "Page A",
    amt: 2400,
  },
  {
    name: "Page B",
    amt: 2210,
  },
  {
    name: "Page C",
    amt: 2290,
  },
  {
    name: "Page D",
    amt: 2000,
  },
  {
    name: "Page E",
    amt: 2181,
  },
  {
    name: "Page F",
    amt: 2500,
  },
  {
    name: "Page G",
    amt: 3000,
  },
];

function MockLineChart() {
  return (
    <div>
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
          tick={false}
          dataKey="name"
          tickLine={false}
          axisLine={false}
          angle={-30}
          minTickGap={10}
          padding={{ left: 30 }}
        />
        <YAxis
          tick={false}
          domain={[
            (dataMin: any) => Math.max(0, dataMin - dataMin / 20),
            (dataMax: any) => dataMax + dataMax / 20,
          ]}
          tickLine={false}
          axisLine={false}
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
          fill="url(#colorUv)"
        />
      </AreaChart>
    </div>
  );
}

export default MockLineChart;
