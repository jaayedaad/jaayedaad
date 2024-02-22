import { Transaction } from "@prisma/client";

// Function to calculate total value
export function calculateTotalValue(transactions: Transaction[]): number {
  const assetBuyPrices: { [assetId: string]: number[] } = {}; // Track buy prices for each asset
  let totalValue = 0;

  transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .forEach((transaction) => {
      if (transaction.type === "buy") {
        // If it's a buy transaction, add to total value
        totalValue += +transaction.quantity * +transaction.price;

        // Also, add to buy prices
        if (!assetBuyPrices[transaction.assetId]) {
          assetBuyPrices[transaction.assetId] = [];
        }
        assetBuyPrices[transaction.assetId].push(+transaction.price);
      } else if (transaction.type === "sell") {
        // If it's a sell transaction, calculate total value based on previous buy prices and subtract
        const buyPrices = assetBuyPrices[transaction.assetId];
        if (buyPrices && buyPrices.length > 0) {
          const previousPrice =
            buyPrices.reduce((acc, cur) => acc + cur, 0) / buyPrices.length; // Calculate average buy price
          totalValue -= +transaction.quantity * previousPrice; // Subtracting the value for sell transactions
        }
      }
    });

  return totalValue;
}

// Function to calculate total quantity
export function calculateTotalQuantity(transactions: Transaction[]) {
  const totalQuantity = transactions.reduce((total, transaction) => {
    if (transaction.type === "buy") {
      return total + parseFloat(transaction.quantity);
    } else if (transaction.type === "sell") {
      return total - parseFloat(transaction.quantity);
    }
    return total;
  }, 0);
  return totalQuantity;
}

// Function to calculate avg buy price after editing transaction
export function calculateAvgBuyPrice(transactions: Transaction[]) {
  transactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  let totalQuantityBought = 0;
  let totalCostOfPurchases = 0;
  let avgPriceBeforeSale = 0;

  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    const { quantity, price, type } = transaction;
    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(price);

    if (type === "buy") {
      totalQuantityBought += quantityNum;
      totalCostOfPurchases += quantityNum * priceNum;
      avgPriceBeforeSale = totalCostOfPurchases / totalQuantityBought;
    } else if (type === "sell") {
      const sellValue = quantityNum * avgPriceBeforeSale;
      totalQuantityBought -= quantityNum;
      totalCostOfPurchases -= sellValue;
      if (totalQuantityBought === 0) {
        avgPriceBeforeSale = 0;
      }
    }
  }

  if (totalQuantityBought === 0) {
    return 0; // No assets remaining, so average price is 0
  } else {
    return totalCostOfPurchases / totalQuantityBought;
  }
}
