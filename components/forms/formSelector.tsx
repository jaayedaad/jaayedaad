import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { MutualFundIcon, StockIcon } from "@/public/feature-svgs/featureIcons";
import AddTransaction from "../addTransaction";
import { TUserManualCategory } from "@/types/types";
import MutualFundsForm from "./mutualFundForm";

type FormSelectorPropsType = {
  usersManualCategories: TUserManualCategory[];
  defaultCurrency: string;
};

function FormSelector({
  defaultCurrency,
  usersManualCategories,
}: FormSelectorPropsType) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="justify-start w-fit xl:pr-8">
          <Plus className="mr-2" size={20} /> Add transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What would you like to invest in?</DialogTitle>
          <DialogDescription>
            Select the type of asset you would like to invest in
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <AddTransaction
            defaultCurrency={defaultCurrency}
            usersManualCategories={usersManualCategories}
          />
          <MutualFundsForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FormSelector;
