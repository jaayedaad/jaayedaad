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
  transactions: {
    id: string;
    date: Date;
    quantity: string;
    price: string;
    type: string;
    assetId: string;
  }[];
  assetPriceUpdates: {
    id: string;
    price: string;
    date: Date;
    assetId: string;
  }[];
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
