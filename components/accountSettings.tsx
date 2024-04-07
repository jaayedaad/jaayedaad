"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import LoadingSpinner from "./ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/helper";
import { TPreference } from "@/lib/types";
import {
  updateUsernameAction,
  verifyUsernameAction,
} from "@/app/(protected)/auth/onboarding/actions";
import { deleteUserAction } from "@/app/(protected)/dashboard/settings/actions";

interface AccountSettingsProps {
  username: string;
}

function AccountSettings({ username }: AccountSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState<string | null>(username);
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);

  const handleSave = async () => {
    try {
      setDisabled(true);
      setLoading(true);
      if (newUsername) {
        const updated = await updateUsernameAction(newUsername);
        if (!updated) {
          throw new Error();
        }
        toast.success("Username updated successfully!");
        window.location.reload();
      }
    } catch {
      toast.error("An error occurred while updating username");
    } finally {
      setDisabled(false);
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const deleted = await deleteUserAction();
      if (deleted) {
        toast.success("Account deleted successfully!");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("An error occurred while deleting account");
    } finally {
    }
  };

  useEffect(() => {
    const timerId = setTimeout(async () => {
      if (newUsername) {
        if (username !== newUsername) {
          if (newUsername !== "") {
            const message = await verifyUsernameAction(newUsername);
            setDisabled(message !== "Username available");
            setErrorMessage(message);
          } else {
            setErrorMessage("Username cannot be empty!");
          }
        } else {
          setErrorMessage("");
        }
      }
    }, 1000);

    return () => clearTimeout(timerId);
  }, [newUsername]);

  const handleUsernameChange = (value: string) => {
    setNewUsername(value);
    setDisabled(true);
  };

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h2 className="text-3xl text-foreground font-bold">Account</h2>
          <p className="text-sm text-muted-foreground">
            Control what others can see about you
          </p>
        </div>
      </div>
      <Separator />

      <div className="flex flex-col gap-4">
        <div className="py-5 px-4 flex gap-2 items-center justify-between border rounded-lg w-full">
          <div>
            <h2 className="text-foreground">Username</h2>
            <p className="text-muted-foreground text-sm">
              Your username which will be used across Jaayedaad.com
            </p>
          </div>
          <div>
            <div className="flex gap-4">
              <Input
                value={newUsername !== null ? newUsername : ""}
                defaultValue={username}
                className="w-[30vw]"
                placeholder="username"
                onChange={(e) => handleUsernameChange(e.target.value)}
              />
              <Button onClick={handleSave} disabled={disabled}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
            <p
              className={cn(
                "text-xs pt-1",
                errorMessage !== ""
                  ? errorMessage.includes("available")
                    ? "text-green-500"
                    : "text-red-500"
                  : "invisible"
              )}
            >
              {errorMessage !== "" ? errorMessage : username}
            </p>
          </div>
        </div>
        <div className="py-5 px-4 flex gap-2 items-center justify-between border rounded-lg w-full">
          <div>
            <h2 className="text-red-600">Danger Zone</h2>
            <p className="text-muted-foreground text-sm">
              Be Careful. Account deletion cannot be undone
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" /> Delete account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete your Jaayedaad account?
                </DialogDescription>
              </DialogHeader>
              <div>
                Your account & data and any preferences you have saved will be
                lost permanently.
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    handleDeleteAccount();
                    signOut();
                  }}
                  variant="destructive"
                  className="w-fit"
                >
                  Remove
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default AccountSettings;
