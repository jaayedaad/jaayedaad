import { useData } from "@/contexts/data-context";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "./ui/separator";
import EditTransaction from "./editTransaction";
import { Button } from "./ui/button";
import { Transaction } from "@prisma/client";
import { ScrollArea } from "./ui/scroll-area";
import TransactionForm from "./transactionForm";

function TransactionHistory({ assetName }: { assetName: string }) {
  const { assets } = useData();
  const [open, setOpen] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction>();

  const assetToView = assets?.find((asset) => asset.name === assetName);
  return (
    <div className="mt-4">
      <Separator />
      <ScrollArea className="h-[212px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[128px]">Date</TableHead>
              <TableHead>Transaction Type</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetToView &&
              assetToView.transactions
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((transaction) => {
                  return (
                    <TableRow
                      className="cursor-pointer"
                      key={transaction.id}
                      onClick={() => {
                        setOpen(true);
                        setTransactionToEdit(transaction);
                      }}
                    >
                      <TableCell className="font-medium">
                        {transaction.date.toString().split("T")[0]}
                      </TableCell>
                      <TableCell>{transaction.type.toUpperCase()}</TableCell>
                      <TableCell className="text-right">
                        {parseFloat(transaction.price).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right">
                        {parseFloat(transaction.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {(
                          +transaction.quantity * +transaction.price
                        ).toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="w-full mt-2 flex justify-end">
        <div className="flex gap-2 w-1/5">
          <Dialog
            open={showTransactionForm}
            onOpenChange={setShowTransactionForm}
          >
            <DialogTrigger asChild>
              <Button
                className="w-full"
                onClick={() => setShowTransactionForm(true)}
              >
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              {assetToView && (
                <TransactionForm
                  selectedAsset={{
                    shortname: assetToView.name,
                    symbol: assetToView.symbol,
                    quoteType: assetToView.type,
                    exchange: assetToView.exchange,
                  }}
                  modalOpen={setShowTransactionForm}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {open && assetToView && transactionToEdit && (
        <EditTransaction
          open={open}
          setOpen={setOpen}
          transaction={transactionToEdit}
          transactionList={assetToView.transactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )}
        />
      )}
    </div>
  );
}

export default TransactionHistory;
