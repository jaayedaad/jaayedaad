"use client";
import { Asset } from "@/actions/getAssetsAction";
import { useData } from "@/contexts/data-context";
import { IndianRupee } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Sector, Cell, Tooltip } from "recharts";
import LoadingSpinner from "./ui/loading-spinner";
import { useVisibility } from "@/contexts/visibility-context";
import colors from "@/constants/colors";

const COLORS = colors;

const label = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, outerRadius, fill, payload, percent } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 0) * cos;
  const sy = cy + (outerRadius + 0) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return percent > 0 ? (
    <g>
      <path
        d={`M${sx},${sy}L${mx},${my < cy ? my + 15 : my - 18}L${ex},${
          ey < cy ? ey + 15 : ey - 18
        }`}
        stroke={fill}
        fill="none"
      />
      <circle
        cx={ex}
        cy={ey < cy ? ey + 15 : ey - 18}
        r={2}
        fill={fill}
        stroke="none"
      />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 6}
        y={ey < cy ? ey + 18 : ey - 18}
        textAnchor={textAnchor}
        fill="#fff"
        fontSize={11}
      >{`${payload.name}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 6}
        y={ey < cy ? ey + 18 : ey - 18}
        dy={10}
        textAnchor={textAnchor}
        fill="#999"
        fontSize={10}
      >{`(${(percent * 100).toFixed(2)}%)`}</text>
    </g>
  ) : null;
};

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

interface PieChartProps {
  view: string; // "stocks" | "crypto" | "funds" | "dashboard"
}

function AssetPieChart({ view }: PieChartProps) {
  const { visible } = useVisibility();
  let { assets: data } = useData();
  const [activeIndex, setActiveIndex] = useState(-1);
  // Create an object to store the sum of values for each type
  const sumByType: {
    [key: string]: number;
  } = {};

  // Iterate over each data object and sum the values for each type
  if (view === "dashboard") {
    data?.forEach((item) => {
      if (item.quantity !== "0") {
        let type: string;
        if (item.type === "CRYPTOCURRENCY") {
          type = "CRYPTO";
        } else if (item.type === "EQUITY") {
          type = "STOCKS";
        } else {
          type = item.type;
        }
        const value = item.symbol ? item.currentValue : +item.currentPrice;
        sumByType[type] = (sumByType[type] || 0) + value;
      }
    });
  } else {
    const filters: Record<string, (asset: Asset) => boolean> = {
      "common stock": (asset) => asset.type === "Common Stock",
      crypto: (asset) => asset.type === "CRYPTOCURRENCY",
      funds: (asset) => asset.type === "MUTUALFUND",
      property: (asset) => asset.type === "PROPERTY",
      jewellery: (asset) => asset.type === "JEWELLERY",
      deposits: (asset) => asset.type === "DEPOSITS",
      others: (asset) => asset.type === "OTHERS",
    };

    const param = decodeURIComponent(view);
    if (param && filters.hasOwnProperty(param)) {
      data = data?.filter(filters[param]);
    } else {
      data = data?.filter((asset) => asset.type === param.toUpperCase());
    }

    data?.forEach((item) => {
      const type = item.name;
      const value = item.symbol ? item.currentValue : +item.currentPrice;
      sumByType[type] = (sumByType[type] || 0) + value;
    });
  }

  // Convert the sumByType object into the desired format
  const chartData = Object.entries(sumByType).map(([type, value]) => ({
    name: type,
    value: parseFloat(value.toFixed(2)), // Round to two decimal places
  }));

  return (
    <>
      <h3 className="font-semibold">Asset Distribution</h3>
      <p className="text-muted-foreground text-sm">
        Visual breakdown of your investments
      </p>
      <div className="flex justify-center mt-2">
        {data ? (
          <PieChart width={400} height={160}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              label={label}
              labelLine={false}
              startAngle={90}
              endAngle={-360}
              innerRadius={40}
              outerRadius={60}
              paddingAngle={chartData.length > 1 ? 5 : 0}
              stroke="none"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {data?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value?.toString();
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-bold flex items-center">
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
          </PieChart>
        ) : (
          <div className="h-40 w-full flex items-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </>
  );
}

export default AssetPieChart;
