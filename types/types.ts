import {
  AssetPriceUpdate,
  PerformanceBarOrder,
  PerformanceBarParameter,
  Transaction,
} from "@prisma/client";
import dynamicIconImports from "lucide-react/dynamicIconImports";

export type TAsset = {
  id: string;
  name: string;
  symbol: string; // shubham: fix this bec its not in prisma schema so shouldnt be here as well
  quantity: string;
  buyPrice: string;
  buyCurrency: string;
  prevClose: string; // shubham: fix this bec its not in prisma schema so shouldnt be here as well
  category: string;
  exchange: string;
  buyDate: Date;
  userId: string;
  currentPrice: string; // shubham: fix this bec its not in prisma schema so shouldnt be here as well
  isManualEntry: boolean;
  currentValue: number; // shubham: fix this bec its not in prisma schema so shouldnt be here as well
  compareValue: number; // shubham: fix this bec its not in prisma schema so shouldnt be here as well
  valueAtInterval: number;
  transactions: Transaction[];
  assetPriceUpdates: AssetPriceUpdate[];
};

export type TTwelveDataResult = {
  instrument_name: string;
  symbol: string;
  instrument_type: string;
  exchange: string;
  mic_code: string;
  currency: string;
  country: string;
  exchange_timezone: string;
};

export type TTwelveDataInstrumentQuote = {
  symbol: string;
  name: string;
  exchange: string;
  mic_code: string;
  currency: string;
  timestamp: number;
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  average_volume: string;
  rolling_1d_change?: string; // Available for crypto
  rolling_7d_change?: string; // Available for crypto
  rolling_period_change?: string; // Available for crypto
  is_market_open: boolean;
  fifty_two_week: {
    low: string;
    high: string;
    low_change: string;
    high_change: string;
    low_change_percent: string;
    high_change_percent: string;
    range: string;
  };
  extended_change?: string;
  extended_percent_change?: string;
  extended_price?: string;
  extended_timestamp?: number;
};

export type TTwelveDataHistoricalData = {
  meta: {
    symbol: string;
    interval: string;
    currency: string;
    exchange_timezone: string;
    exchange: string;
    mic_code: string;
    type: string;
  };
  values: {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
  }[];
  status: string;
};

export type TTwelveDataHistoricalDataErrorResponse = {
  code: number;
  message: string;
  status: string;
  meta: {
    symbol: string;
    interval: string;
    exchange: string;
  };
};

export type THistoricalData = {
  meta?: {
    symbol: string;
    interval: string;
    currency: string;
    exchange_timezone: string;
    exchange: string;
    mic_code: string;
    type: string;
  };
  values: {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    previous_close: string;
    date: number;
    value: number;
  }[];
  status?: string;
  assetType: string;
  assetSymbol: string | null;
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
  performanceBarOrder: PerformanceBarOrder;
  performanceBarParameter: PerformanceBarParameter;
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
  category: string;
  symbol: string;
  compareValue: string;
  valueAtInterval: number;
  currentValue: string;
  prevClose: string;
  interval: string;
  unrealisedProfitLoss: string;
};

export type TGroupedAssets = {
  category: string;
  currentValue: number;
  compareValue: number;
  valueAtInterval: number;
}[];

export type TManualCategoryIcons = keyof typeof dynamicIconImports;
