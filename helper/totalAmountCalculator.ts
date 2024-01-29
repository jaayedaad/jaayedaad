import { Asset } from "@/actions/getAssetsAction";

export function totalAmountCalculator(assets: Asset[], conversionRate: String) {
  const amounts = assets
    .map((asset) => {
      const { buyCurrency, quantity, buyPrice, prevClose } = asset;
      const conversionFactor = buyCurrency === "USD" ? +conversionRate : 1;

      const buyAmount = +quantity * +buyPrice * conversionFactor;
      const currentAmount = +quantity * +prevClose * conversionFactor;

      return { buyAmount, currentAmount };
    })
    .reduce(
      (accumulator, current) => {
        accumulator.buyAmount += current.buyAmount;
        accumulator.currentAmount += current.currentAmount;
        return accumulator;
      },
      { buyAmount: 0, currentAmount: 0 }
    );

  return amounts;
}
