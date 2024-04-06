import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Preference } from "@prisma/client";
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

interface AccountSettingsProps {
  username: string;
  preferences: Preference;
  setPreferences: React.Dispatch<React.SetStateAction<Preference | undefined>>;
}

function AccountSettings({ username, preferences }: AccountSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState<string | null>(username);
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);

  const handleSave = async () => {
    try {
      setDisabled(true);
      setLoading(true);
      if (newUsername) {
        await fetch(`/api/onboarding?username=${newUsername}`, {
          method: "GET",
        });
        window.location.reload();
      }
    } finally {
      setDisabled(false);
      setLoading(false);
      toast.success("Preferences updated successfully!");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await fetch(`/api/user/${preferences.userId}`, {
        method: "POST",
      });
    } finally {
      toast.success("Account deleted successfully!");
    }
  };

  // Check for availability of username
  const verifyUsername = async (newUsername: string) => {
    if (newUsername !== username) {
      const regex = /^[a-zA-Z0-9_]+$/; // regular expression for alphanumeric characters & underscores
      if (!regex.test(newUsername)) {
        setErrorMessage("Letters, numbers, or underscores only!");
        return;
      } else if (newUsername.length < 3) {
        setErrorMessage("Username must be at least 3 characters!");
        return;
      }
      const data = await fetch("/api/onboarding", {
        method: "POST",
        body: JSON.stringify({ username: newUsername.toLowerCase() }),
      });
      const user: object[] = await data.json();
      if (user.length === 0) {
        setErrorMessage("Username available");
        setDisabled(false);
      } else {
        setErrorMessage("This username is already taken!");
      }
    } else {
      setDisabled(false);
      setErrorMessage("");
    }
  };

  // Accomodates live username change
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (newUsername) {
        if (newUsername !== "") {
          verifyUsername(newUsername);
        }
      } else {
        setErrorMessage("Username cannot be empty!");
      }
    }, 1000);

    // Clear the timer on each change
    return () => clearTimeout(timerId);
  }, [newUsername]);

  // handles username field and disables button while typing
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
      {preferences ? (
        <div className="flex flex-col gap-4">
          <div className="py-5 px-4 flex gap-2 items-center justify-between border rounded-md w-full">
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
          <div className="py-5 px-4 flex gap-2 items-center justify-between border rounded-md w-full">
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
      ) : (
        <div className="mt-48">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}

export default AccountSettings;
