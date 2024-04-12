"use client";
import { TAsset, TConversionRates } from "@/lib/types";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "./ui/loading-spinner";
import colors from "@/constants/colors";
import MockPieChart from "./mock/mockPieChart";

const COLORS = colors;

const payloadNameMappings: Record<string, string> = {
  "Common Stock": "Stocks",
  "Digital Currency": "Crypto",
  // Add other mappings here
};

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
        fontSize={16}
      >{`${payloadNameMappings[payload.name] || payload.name}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 6}
        y={ey < cy ? ey + 18 : ey - 18}
        dy={13}
        textAnchor={textAnchor}
        fill="#999"
        fontSize={14}
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
  assetCategoryName?: string;
  assets: TAsset[] | undefined;
  view: string; // "stocks" | "crypto" | "funds" | "dashboard"
  dashboardAmountVisibility: boolean;
  numberSystem: string;
  defaultCurrency: string;
  conversionRates: TConversionRates;
}

function AssetPieChart({
  assetCategoryName = "Asset",
  view,
  assets,
  dashboardAmountVisibility,
  numberSystem,
  defaultCurrency,
  conversionRates,
}: PieChartProps) {
  let data = assets;
  const formatter = new Intl.NumberFormat(
    numberSystem === "Indian" ? "en-IN" : "en-US",
    {
      style: "currency",
      currency: defaultCurrency || "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  // Create an object to store the sum of values for each type
  const sumByType: {
    [key: string]: number;
  } = {};

  // Iterate over each data object and sum the values for each type
  if (view === "dashboard") {
    data?.forEach((item) => {
      if (item.quantity !== "0" && conversionRates) {
        const currencyConversion =
          conversionRates[item.buyCurrency.toLowerCase()];
        const multiplier = 1 / currencyConversion;
        const category: string = item.category;
        const value = item.symbol
          ? item.currentValue * multiplier
          : +item.currentPrice * +item.quantity * multiplier;
        sumByType[category] = (sumByType[category] || 0) + value;
      }
    });
  } else {
    const param = decodeURIComponent(view);
    data = data?.filter((asset) => asset.category.toLowerCase() === param);

    data?.forEach((item) => {
      if (conversionRates) {
        const currencyConversion =
          conversionRates[item.buyCurrency.toLowerCase()];
        const multiplier = 1 / currencyConversion;
        const type = item.name;
        const value = item.symbol
          ? item.currentValue * multiplier
          : +item.currentPrice * +item.quantity * multiplier;
        sumByType[type] = (sumByType[type] || 0) + value;
      }
    });
  }

  // Convert the sumByType object into the desired format
  const chartData = Object.entries(sumByType).map(([type, value]) => ({
    name: type,
    value: parseFloat(value.toFixed(2)), // Round to two decimal places
  }));

  return (
    <>
      <h3 className="font-semibold">{assetCategoryName} Distribution</h3>
      <p className="text-muted-foreground text-xs xl:text-sm">
        Breakdown of your investments
      </p>
      <div className="mt-2 h-full">
        {data ? (
          data.length ? (
            <div className="mt-2 h-full">
              <ResponsiveContainer width="100%" height="75%">
                <PieChart>
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
                    innerRadius={55}
                    outerRadius={75}
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
                                {dashboardAmountVisibility
                                  ? formatter.format(parseFloat(value!))
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
              </ResponsiveContainer>
            </div>
          ) : (
            <MockPieChart />
          )
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
