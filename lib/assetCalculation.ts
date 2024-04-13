import { TAsset } from "./types";

export const calculateCurrentValue = (asset: TAsset): TAsset => {
  const calculateBaseValue = () => {
    const investedValue = +asset.buyPrice * +asset.quantity;
    return investedValue;
  };

  const calculateYearsSinceCreated = () => {
    const buyDate = new Date(asset.buyDate);
    const today = new Date();
    const differenceInMilliseconds = today.getTime() - buyDate.getTime(); // Difference in milliseconds
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    return Math.floor(differenceInDays / 365);
  };

  const calculateCurrentValueForFD = () => {
    const yearsSinceCreated = calculateYearsSinceCreated();
    return (
      +asset.buyPrice *
      (1 + parseFloat(asset.quantity) / 100) ** yearsSinceCreated
    );
  };

  try {
    if (asset.category === "Deposits") {
      asset.currentValue = calculateCurrentValueForFD();
      asset.currentPrice = asset.currentValue.toString();
      asset.prevClose = asset.currentPrice;
      asset.compareValue = +asset.buyPrice;

      return asset;
    } else {
      asset.compareValue = calculateBaseValue();
      asset.currentValue = asset.isManualEntry
        ? (asset.currentPrice !== null ? +asset.currentPrice : 0) *
          +asset.quantity
        : (asset.prevClose !== undefined ? +asset.prevClose : 0) *
          +asset.quantity;
      return asset;
    }
  } catch (err) {
    console.error("Error in calculateCurrentValue: " + err);
    return asset;
  }
};
