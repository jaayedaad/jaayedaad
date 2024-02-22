import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { Transaction } from "@prisma/client";
import {
  calculateAvgBuyPrice,
  calculateTotalQuantity,
  calculateTotalValue,
} from "@/helper/transactionValueCalculator";

interface requestBody {
  transactionToEdit: Transaction;
  transactionList: Transaction[];
}

async function updateTransaction(
  transactionToEdit: Transaction,
  transactionList: Transaction[],
  currentQuantity: number,
  futureQuantity: number,
  futureTransactions: Transaction[]
) {
  if (futureTransactions.length > 0) {
    const editedTransaction = await prisma.transaction.update({
      where: {
        id: transactionToEdit.id,
      },
      data: {
        quantity: transactionToEdit.quantity,
        price: transactionToEdit.price,
        date: transactionToEdit.date,
      },
    });

    // update asset price and quantity
    const avgBuyPrice = calculateAvgBuyPrice(transactionList);
    const updatedAsset = await prisma.asset.update({
      where: {
        id: transactionToEdit.assetId,
      },
      data: {
        quantity: (futureQuantity + currentQuantity).toString(),
        buyPrice: avgBuyPrice.toString(),
      },
    });
  } else {
    const editedTransaction = await prisma.transaction.update({
      where: {
        id: transactionToEdit.id,
      },
      data: {
        quantity: transactionToEdit.quantity,
        price: transactionToEdit.price,
        date: transactionToEdit.date,
      },
    });

    // update asset price and quantity
    const avgBuyPrice = calculateAvgBuyPrice(transactionList);
    const updatedAsset = await prisma.asset.update({
      where: {
        id: transactionToEdit.assetId,
      },
      data: {
        quantity: currentQuantity.toString(),
        buyPrice: avgBuyPrice.toString(),
      },
    });
  }
}

export async function PUT(req: Request) {
  const { transactionToEdit, transactionList }: requestBody = await req.json();
  const session = await getServerSession(authOptions);

  if (session) {
    // Convert date strings to Date objects for comparison
    const transactionDate = new Date(transactionToEdit.date);

    // Filter the transactionList to find transactions with a date more recent than transactionToEdit
    const futureTransactions = transactionList.filter((transaction) => {
      const transactionDateToCompare = new Date(transaction.date);
      return (
        transactionDateToCompare > transactionDate &&
        transactionToEdit.id !== transaction.id
      );
    });

    // Filter the transactionList to find transactions with a date more older than transactionToEdit
    const pastTransactions = transactionList.filter((transaction) => {
      const transactionDateToCompare = new Date(transaction.date);
      return (
        transactionDateToCompare < transactionDate &&
        transactionToEdit.id !== transaction.id
      );
    });

    // Sum up the quantity based on the transaction type for past transactions
    const prevQuantity = calculateTotalQuantity(pastTransactions);

    // Sum up the quantity based on the transaction type for recent transactions
    const futureQuantity = calculateTotalQuantity(futureTransactions);

    // Check if the recent transactions have a sell type transaction
    const hasSellTransaction = futureTransactions.some(
      (transaction) => transaction.type === "sell"
    );

    const index = transactionList.findIndex(
      (transaction) => transaction.id === transactionToEdit.id
    );
    if (index !== -1) {
      transactionList[index] = transactionToEdit;
    }

    if (pastTransactions.length > 0) {
      if (futureTransactions.length > 0) {
        if (transactionToEdit.type === "buy") {
          if (prevQuantity >= 0) {
            // New current quantity till the transactionToEdit's date
            const currentQuantity =
              prevQuantity + parseFloat(transactionToEdit.quantity);

            if (hasSellTransaction) {
              if (currentQuantity + futureQuantity >= 0) {
                updateTransaction(
                  transactionToEdit,
                  transactionList,
                  currentQuantity,
                  futureQuantity,
                  futureTransactions
                );
                return Response.json({
                  success: "Transaction edited successfully!",
                });
              } else {
                return Response.json({ error: "Invalid edit request!" });
              }
            } else {
              updateTransaction(
                transactionToEdit,
                transactionList,
                currentQuantity,
                futureQuantity,
                futureTransactions
              );
              return Response.json({
                success: "Transaction edited successfully!",
              });
            }
          } else {
            return Response.json({ error: "Invalid edit request!" });
          }
        } else {
          // New current quantity till the transactionToEdit's date
          const currentQuantity =
            prevQuantity - parseFloat(transactionToEdit.quantity);
          if (currentQuantity >= 0) {
            if (hasSellTransaction) {
              if (currentQuantity + futureQuantity >= 0) {
                updateTransaction(
                  transactionToEdit,
                  transactionList,
                  currentQuantity,
                  futureQuantity,
                  futureTransactions
                );
                return Response.json({
                  success: "Transaction edited successfully!",
                });
              } else {
                return Response.json({ error: "Invalid edit request!" });
              }
            } else {
              updateTransaction(
                transactionToEdit,
                transactionList,
                currentQuantity,
                futureQuantity,
                futureTransactions
              );
              return Response.json({
                success: "Transaction edited successfully!",
              });
            }
          } else {
            return Response.json({ error: "Invalid edit request!" });
          }
        }
      } else {
        if (transactionToEdit.type === "buy") {
          if (prevQuantity >= 0) {
            const currentQuantity = prevQuantity + +transactionToEdit.quantity;
            updateTransaction(
              transactionToEdit,
              transactionList,
              currentQuantity,
              futureQuantity,
              futureTransactions
            );
            return Response.json({
              success: "Transaction edited successfully!",
            });
          } else {
            return Response.json({ error: "Invalid edit request!" });
          }
        } else {
          if (prevQuantity > 0) {
            // New current quantity till the transactionToEdit's date
            const currentQuantity =
              prevQuantity - parseFloat(transactionToEdit.quantity);
            if (currentQuantity >= 0) {
              updateTransaction(
                transactionToEdit,
                transactionList,
                currentQuantity,
                futureQuantity,
                futureTransactions
              );
              return Response.json({
                success: "Transaction edited successfully!",
              });
            } else {
              return Response.json({ error: "Invalid edit request!" });
            }
          } else {
            return Response.json({ error: "Invalid edit request!" });
          }
        }
      }
    } else {
      if (transactionToEdit.type === "buy") {
        // New current quantity till the transactionToEdit's date
        const currentQuantity = parseFloat(transactionToEdit.quantity);

        if (hasSellTransaction) {
          if (futureQuantity + currentQuantity >= 0) {
            updateTransaction(
              transactionToEdit,
              transactionList,
              currentQuantity,
              futureQuantity,
              futureTransactions
            );
            return Response.json({
              success: "Transaction edited successfully!",
            });
          } else {
            return Response.json({ error: "Invalid edit request!" });
          }
        } else {
          updateTransaction(
            transactionToEdit,
            transactionList,
            currentQuantity,
            futureQuantity,
            futureTransactions
          );
          return Response.json({ success: "Transaction edited successfully!" });
        }
      } else {
        return Response.json({ error: "Invalid edit request!" });
      }
    }
  }
}
