import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { Transaction } from "@prisma/client";
import {
  calculateAvgBuyPrice,
  calculateTotalQuantity,
} from "@/helper/transactionValueCalculator";
import { isValidTransactions } from "@/helper/canSellAssets";
import CryptoJS from "crypto-js";
import { getAssetById } from "@/helper/sia/getAssetById";
import { encryptDataValue, encryptObjectValues } from "@/lib/dataSecurity";
import { DATABASE_URL, ENCRYPTION_KEY, USE_SIA } from "@/constants/env";
import { uploadToSia } from "@/services/thirdParty/sia";

interface requestBody {
  transactionToEdit: Transaction;
  transactionList: Transaction[];
}

async function updateTransaction(
  userId: string,
  transactionToEdit: Transaction,
  transactionList: Transaction[],
  currentQuantity: number,
  futureQuantity: number
) {
  const encryptionKey = userId.slice(0, 4) + ENCRYPTION_KEY + userId.slice(-4);
  const avgBuyPrice = calculateAvgBuyPrice(transactionList);
  if (USE_SIA) {
    // update transaction
    const updatedTransaction = JSON.stringify({
      data: CryptoJS.AES.encrypt(
        JSON.stringify({
          ...transactionToEdit,
          quantity: transactionToEdit.quantity,
          price: transactionToEdit.price,
          date: transactionToEdit.date,
        }),
        encryptionKey
      ).toString(),
    });

    await uploadToSia({
      data: updatedTransaction,
      path: `${userId}/assets/${transactionToEdit.assetId}/transactions/${transactionToEdit.id}`,
    });

    // update asset price and quantity
    const assetToUpdate = await getAssetById(userId, transactionToEdit.assetId);
    const updatedAsset = JSON.stringify({
      data: CryptoJS.AES.encrypt(
        JSON.stringify({
          ...assetToUpdate,
          quantity: (futureQuantity + currentQuantity).toString(),
          buyPrice: avgBuyPrice.toString(),
        }),
        encryptionKey
      ).toString(),
    });

    await uploadToSia({
      data: updatedAsset,
      path: `${userId}/assets/${assetToUpdate.id}/data`,
    });
  }
  if (DATABASE_URL) {
    // encrypt data
    const encryptedData: {
      quantity: string;
      price: string;
      date: Date;
    } = encryptObjectValues(
      {
        quantity: transactionToEdit.quantity,
        price: transactionToEdit.price,
        date: transactionToEdit.date,
      },
      encryptionKey
    );
    // update transaction
    const editedTransaction = await prisma.transaction.update({
      where: {
        id: transactionToEdit.id,
      },
      data: encryptedData,
    });

    // update asset price and quantity
    const updatedAsset = await prisma.asset.update({
      where: {
        id: transactionToEdit.assetId,
      },
      data: {
        quantity: encryptDataValue(
          (futureQuantity + currentQuantity).toString(),
          encryptionKey
        ),
        buyPrice: encryptDataValue(avgBuyPrice.toString(), encryptionKey),
      },
    });
  }
}

export async function PUT(req: Request) {
  const { transactionToEdit, transactionList }: requestBody = await req.json();
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user.email!,
      },
    });
    if (user) {
      const index = transactionList.findIndex(
        (transaction) => transaction.id === transactionToEdit.id
      );
      if (index !== -1) {
        transactionList[index] = transactionToEdit;
      }

      const canEditTransaction = isValidTransactions(transactionList);
      if (canEditTransaction) {
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

        if (pastTransactions.length > 0) {
          if (transactionToEdit.type === "buy") {
            const currentQuantity =
              prevQuantity + parseFloat(transactionToEdit.quantity);

            updateTransaction(
              user.id,
              transactionToEdit,
              transactionList,
              currentQuantity,
              futureQuantity
            );

            return Response.json({
              success: "Transaction edited successfully!",
            });
          } else {
            const currentQuantity =
              prevQuantity - parseFloat(transactionToEdit.quantity);

            updateTransaction(
              user.id,
              transactionToEdit,
              transactionList,
              currentQuantity,
              futureQuantity
            );

            return Response.json({
              success: "Transaction edited successfully!",
            });
          }
        } else {
          const currentQuantity = parseFloat(transactionToEdit.quantity);

          updateTransaction(
            user.id,
            transactionToEdit,
            transactionList,
            currentQuantity,
            futureQuantity
          );

          return Response.json({
            success: "Transaction edited successfully!",
          });
        }
      } else {
        return Response.json({ error: "Invalid edit request!" });
      }
    }
  }
}
