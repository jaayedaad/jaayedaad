import dynamicIconImports from "lucide-react/dynamicIconImports";

export const categories: {
  value: string;
  label: string;
  icon: keyof typeof dynamicIconImports;
}[] = [
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
