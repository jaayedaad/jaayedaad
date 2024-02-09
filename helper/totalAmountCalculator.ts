import { Asset } from "@/actions/getAssetsAction";
import { getConversionRate } from "@/actions/getConversionRateAction";

export function totalAmountCalculator(assets: Asset[]) {
  let conversionRate = "";
  getConversionRate().then((data) => (conversionRate = data));
  const amounts = assets
    .map((asset) => {
      const { buyCurrency, quantity, buyPrice, prevClose } = asset;
      const conversionFactor = buyCurrency === "USD" ? +conversionRate : 1;

      const buyAmount = +quantity * +buyPrice * conversionFactor;
      const currentAmount = asset.currentValue;

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
