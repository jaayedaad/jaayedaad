import { AssetPriceUpdate, Transaction } from "@prisma/client";

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

export interface TSiaObject {
  eTag: string;
  health: number;
  modTime: string;
  name: string;
  size: number;
  mimeType: string;
}
