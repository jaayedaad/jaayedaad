import React, { useState } from "react";
import { Cell, Pie, PieChart, Sector, Tooltip } from "recharts";

const COLORS = ["#46B0FF", "#F2AE00", "#F91F87", "#11FD53"];

const chartData = [
  {
    name: "Page A",
    value: 400,
  },
  {
    name: "Page B",
    value: 2210,
  },
  {
    name: "Page C",
    value: 1790,
  },
  {
    name: "Page D",
    value: 1100,
  },
];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

function MockPieChart() {
  const [activeIndex, setActiveIndex] = useState(-1);
  return (
    <div>
      <PieChart width={400} height={200}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          labelLine={false}
          startAngle={90}
          endAngle={-360}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={chartData.length > 1 ? 5 : 0}
          stroke="none"
          dataKey="value"
          onMouseEnter={(_, index) => setActiveIndex(index)}
        >
          {chartData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={() => {
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="flex flex-col">
                  <span className="font-bold flex items-center">
                    Add assets to get your distribution
                  </span>
                </div>
              </div>
            );
          }}
        />
      </PieChart>
    </div>
  );
}

export default MockPieChart;
