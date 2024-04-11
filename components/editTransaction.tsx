import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { DatePicker } from "./ui/date-picker";
import { Button } from "./ui/button";
import { Transaction } from "@prisma/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditTransactionProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transaction: Transaction;
  transactionList: Transaction[];
}

function EditTransaction({
  open,
  setOpen,
  transaction,
  transactionList,
}: EditTransactionProps) {
  const [editedQuantity, setEditedQuantity] = useState(transaction.quantity);
  const [editedPrice, setEditedPrice] = useState(transaction.price);
  const [editedDate, setEditedDate] = useState(transaction.date);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle Edit Transaction
  const handleEditTransaction = async (transactionToEdit: Transaction) => {
    setLoading(true);
    const body = { transactionToEdit: transactionToEdit, transactionList };
    fetch("/api/transactions/edit", {
      method: "PUT",
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setLoading(false);
          toast.error(data.error);
        } else {
          setLoading(false);
          setOpen(false);
          toast.success(data.success);
          router.refresh();
        }
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 self-center">Quantity</div>
          <Input
            className="col-span-2"
            value={editedQuantity}
            onChange={(e) => setEditedQuantity(e.target.value)}
          />
          <div className="col-span-1 self-center">Price</div>
          <Input
            className="col-span-2"
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.target.value)}
          />
          <div className="col-span-1 self-center">Date</div>
          <div className="col-span-2">
            <DatePicker
              onSelect={(value) => setEditedDate(value)}
              defaultDate={transaction.date}
            />
          </div>
          <div className="col-start-3">
            <DialogFooter className="sm:justify-start">
              <Button
                className="w-full"
                variant="secondary"
                disabled={loading}
                onClick={() =>
                  handleEditTransaction({
                    ...transaction,
                    quantity: editedQuantity,
                    price: editedPrice,
                    date: new Date(
                      editedDate.setDate(editedDate.getDate() + 1)
                    ),
                  })
                }
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditTransaction;
