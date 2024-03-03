import { Transaction } from "@prisma/client";

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
