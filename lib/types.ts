import { AssetPriceUpdate, Transaction } from "@prisma/client";
import dynamicIconImports from "lucide-react/dynamicIconImports";

export type TAsset = {
  id: string;
  name: string;
  symbol: string; // shubham: fix this bec its not in prisma schema so shouldnt be here as well
  quantity: string;
  buyPrice: string;
  buyCurrency: string;
  prevClose: string; // shubham: fix this bec its not in prisma schema so shouldnt be here as well
  type: string;
  exchange: string;
  buyDate: Date;
  userId: string;
  currentPrice: string; // shubham: fix this bec its not in prisma schema so shouldnt be here as well
  isManualEntry: boolean;
  currentValue: number; // shubham: fix this bec its not in prisma schema so shouldnt be here as well
  compareValue: number; // shubham: fix this bec its not in prisma schema so shouldnt be here as well
  transactions: Transaction[];
  assetPriceUpdates: AssetPriceUpdate[];
};

export type TInterval = "1d" | "1w" | "1m" | "1y" | "All";

export type TProfitLoss = {
  interval: string;
  realisedProfitLoss: string;
};

export type TSiaObject = {
  eTag: string;
  health: number;
  modTime: string;
  name: string;
  size: number;
  mimeType: string;
};

export type TConversionRates = {
  [currency: string]: number;
};

export type TUser = {
  id: string;
  name: string;
  username?: string;
  email: string;
  emailVerified: boolean;
  image: string;
  whitelisted: boolean;
};

export type TPreference = {
  id: string;
  publicVisibility: boolean;
  userId: string;
  defaultCurrency: string;
  numberSystem: string;
  showHoldingsInPublic: boolean;
  showMetricsInPublic: boolean;
  performanceBarOrder: string;
  dashboardAmountVisibility: boolean;
};

export type TUserManualCategory = {
  id: string;
  icon: keyof typeof dynamicIconImports;
  name: string;
  userId: string;
  assets: TAsset[];
};

export type TUnrealisedProfitLoss = {
  type: string;
  symbol: string;
  compareValue: string;
  currentValue: string;
  prevClose: string;
  interval: string;
  unrealisedProfitLoss: string;
};
