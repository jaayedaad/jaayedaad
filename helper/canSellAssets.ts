import { Asset } from "@prisma/client";

// Function to check if the user can sell the specified quantity
export function canSellAssets(quantity: string, holdings: Asset[]) {
  let remainingQuantity = quantity;

  // Sort holdings by buyDate in ascending order
  const sortedHoldings = holdings.sort(
    (a, b) => new Date(a.buyDate).getTime() - new Date(b.buyDate).getTime()
  );

  for (const holding of sortedHoldings) {
    if (+holding.quantity >= +remainingQuantity) {
      // If the current holding has enough quantity to cover the sell request
      return true;
    } else {
      // If the current holding doesn't cover the full sell request, subtract its quantity
      remainingQuantity = (+remainingQuantity - +holding.quantity).toString();
    }
  }

  // If we reach this point, the user doesn't have enough quantity to cover the sell request
  return false;
}
