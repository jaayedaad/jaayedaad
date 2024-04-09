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
    <div className="mt-12">
      <AreaChart width={720} height={200} data={dataToShow}>
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
