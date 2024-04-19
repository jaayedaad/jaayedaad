import { PerformanceBarOrder, PerformanceBarParameter } from "@prisma/client";

export const performanceBarOrder: {
  value: PerformanceBarOrder;
  label: string;
}[] = [
  { value: "Ascending", label: "Ascending" },
  { value: "Descending", label: "Descending" },
];

export const performanceBarParameter: {
  value: PerformanceBarParameter;
  label: string;
}[] = [
  { value: "totalInvestment", label: "Amount Invested" },
  { value: "totalValue", label: "Current Value" },
  { value: "percentageChange", label: "Growth Percentage" },
];
