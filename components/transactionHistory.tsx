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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "./ui/separator";
import EditTransaction from "./editTransaction";
import { Button } from "./ui/button";
import { Transaction } from "@prisma/client";
import { ScrollArea } from "./ui/scroll-area";
import TransactionForm from "./transactionForm";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import RemoveAssetButton from "./removeAssetButton";

function TransactionHistory({ assetName }: { assetName: string }) {
  const { assets } = useData();
  const [open, setOpen] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction>();

  const assetToView = assets?.find((asset) => asset.name === assetName);

  const handleRemoveAsset = async (id: string) => {
    fetch("/api/assets/remove", {
      method: "POST",
      body: JSON.stringify(id),
    }).then(() => {
      toast.success("Asset removed successfully!");
      setOpen(false);
    });
  };

  return (
    <div className="mt-4 flex flex-col justify-between">
      <div>
        <Separator />
        <ScrollArea className="h-[65vh] lg:h-[360px] w-[78vw] md:w-[50vw] lg:w-full">
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
                          {parseFloat(transaction.price).toLocaleString(
                            "en-IN"
                          )}
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
      </div>
      <div className="mt-2 flex justify-end w-full">
        <div className="flex gap-2">
          <Dialog
            open={showTransactionForm}
            onOpenChange={setShowTransactionForm}
          >
            <DialogTrigger asChild>
              <Button
                className="w-fit pr-6"
                onClick={() => setShowTransactionForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            {assetToView && <RemoveAssetButton assetId={assetToView.id} />}
            <DialogContent>
              {assetToView && (
                <TransactionForm
                  selectedAsset={{
                    instrument_name: assetToView.name,
                    symbol: assetToView.symbol,
                    prevClose: assetToView.prevClose,
                    instrument_type: assetToView.type,
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
