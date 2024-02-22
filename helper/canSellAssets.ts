import { Transaction } from "@prisma/client";
import { calculateTotalQuantity } from "./transactionValueCalculator";

// // Function to check if the user can sell the specified quantity
// export function canSellAssets(quantity: string, holdings: Asset[]) {
//   let remainingQuantity = quantity;

//   // Sort holdings by buyDate in ascending order
//   const sortedHoldings = holdings.sort(
//     (a, b) => new Date(a.buyDate).getTime() - new Date(b.buyDate).getTime()
//   );

//   for (const holding of sortedHoldings) {
//     if (holding.type === "buy") {
//       if (+holding.quantity >= +remainingQuantity) {
//         // If the current holding has enough quantity to cover the sell request
//         return true;
//       } else {
//         // If the current holding doesn't cover the full sell request, subtract its quantity
//         remainingQuantity = (+remainingQuantity - +holding.quantity).toString();
//       }
//     }
//   }

//   // If we reach this point, the user doesn't have enough quantity to cover the sell request
//   return false;
// }

interface sellRequest {
  name: string;
  quantity: string;
  price: string;
  date: string;
}

export function isValidTransactions(transactions: Transaction[]) {
  transactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let cumulativeQuantity = 0;

  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];

    if (transaction.type === "buy") {
      cumulativeQuantity += parseFloat(transaction.quantity);
    } else if (transaction.type === "sell") {
      cumulativeQuantity -= parseFloat(transaction.quantity);
    }

    if (cumulativeQuantity < 0) {
      return false; // Quantity became negative, so transactions are invalid
    }
  }

  return true; // If loop completes without finding any negative cumulative quantity, transactions are valid
}

export function canSellAssets(
  sellRequest: sellRequest,
  transactions: Transaction[]
) {
  const newTransaction = {
    id: sellRequest.name,
    date: new Date(sellRequest.date),
    quantity: sellRequest.quantity,
    price: sellRequest.price,
    type: "sell",
    assetId: transactions[0].assetId,
  };

  transactions.push(newTransaction);
  const canSell = isValidTransactions(transactions);
  return canSell;
}
