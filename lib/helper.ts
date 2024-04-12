import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const areDatesEqual = (date1: Date, date2: Date): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Set time components to 0 to ignore time
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  // Compare year, month, and day
  return d1.getTime() === d2.getTime();
};

export const capitalize = (inputStr: string) => {
  if (!inputStr) return "";
  return inputStr.charAt(0).toUpperCase() + inputStr.slice(1);
};
