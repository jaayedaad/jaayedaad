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
import { TUserManualCategory } from "@/types/types";
import MutualFundsForm from "./mutualFundForm";
import StocksForm from "./stocksForm";
import CryptoForm from "./cryptoForm";
import OthersForm from "./othersForm";

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
          <StocksForm defaultCurrency={defaultCurrency} />
          <MutualFundsForm />
          <CryptoForm defaultCurrency={defaultCurrency} />
          <OthersForm
            defaultCurrency={defaultCurrency}
            usersManualCategories={usersManualCategories}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FormSelector;
