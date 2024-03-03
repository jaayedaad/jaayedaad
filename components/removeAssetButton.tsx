import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/data-context";

interface RemoveAssetButtonProps {
  assetId: string;
}

function RemoveAssetButton({ assetId }: RemoveAssetButtonProps) {
  const { updateData } = useData();
  const [openDeleteWarning, setOpenDeleteWarning] = useState(false);
  const handleRemoveAsset = async (assetId: string) => {
    fetch("/api/assets/remove", {
      method: "POST",
      body: JSON.stringify(assetId),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast.success("Asset removed successfully!");
          updateData();
          setOpenDeleteWarning(false);
        } else {
          toast.error("Error removing asset!");
          setOpenDeleteWarning(false);
        }
      });
  };
  return (
    <Dialog open={openDeleteWarning} onOpenChange={setOpenDeleteWarning}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently remove this
            asset from your account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button
            onClick={() => handleRemoveAsset(assetId)}
            variant="destructive"
            className="w-fit"
          >
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RemoveAssetButton;
