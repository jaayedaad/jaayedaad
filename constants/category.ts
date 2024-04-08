import dynamicIconImports from "lucide-react/dynamicIconImports";

export const categories: {
  value: string;
  label: string;
  icon: keyof typeof dynamicIconImports;
}[] = [
  { value: "Common Stock", label: "Stocks", icon: "candlestick-chart" },
  { value: "Digital Currency", label: "Crypto", icon: "bitcoin" },
  { value: "Mutual Fund", label: "Mutual Funds", icon: "square-stack" },
  { value: "Property", label: "Property", icon: "land-plot" },
  { value: "Jewellery", label: "Jewellery", icon: "gem" },
  { value: "Deposits", label: "Fixed Deposit", icon: "landmark" },
  { value: "Others", label: "Others", icon: "shapes" },
];

export const defaultCategories = [
  "common stock",
  "digital currency",
  "mutual fund",
];
