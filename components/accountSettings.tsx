import React, { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { getPreferences } from "@/actions/getPreferencesAction";
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

interface AccountSettingsProps {
  preferences: Preference;
  setPreferences: React.Dispatch<
    React.SetStateAction<
      | {
          id: string;
          publicProfile: boolean;
          defaultCurrency: string;
          numberSystem: string;
          showHoldings: boolean;
          showMetrics: boolean;
          userId: string;
        }
      | undefined
    >
  >;
}

function AccountSettings({
  preferences,
  setPreferences,
}: AccountSettingsProps) {
  const [showHoldings, setShowHoldings] = useState(preferences.showHoldings);
  const [showMetrics, setShowMetrics] = useState(preferences.showMetrics);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPreferences().then((preferences: Preference) => {
      setShowHoldings(preferences.showHoldings);
      setShowMetrics(preferences.showMetrics);
    });
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const preferences = {
        showHoldings,
        showMetrics,
      };
      await fetch("/api/user/preferences", {
        method: "POST",
        body: JSON.stringify(preferences),
      });
    } finally {
      setPreferences({
        ...preferences,
        showHoldings,
        showMetrics,
      });
      setLoading(false);
      toast.success("Preferences updated successfully!");
    }
  };

  const handleDeleteAccount = async () => {};

  return (
    <>
      <div className="flex justify-between">
        <div className="mb-4">
          <h2 className="text-3xl font-bold">Account</h2>
          <p className="text-sm text-muted-foreground">
            Control what others can see about you
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
      <Separator className="my-4" />
      {preferences ? (
        <div className="flex flex-col gap-4">
          <div className="py-5 px-4 flex gap-2 items-center justify-between border rounded-md w-full">
            <div>
              <h2>Holdings</h2>
              <p className="text-muted-foreground text-sm">
                Allow others to see your portfolio holdings on your public
                profile page
              </p>
            </div>
            <Switch
              checked={showHoldings}
              onCheckedChange={(value) => setShowHoldings(value)}
            />
          </div>
          <div className="py-5 px-4 flex gap-2 items-center justify-between border rounded-md w-full">
            <div>
              <h2>Portfolio metrics</h2>
              <p className="text-muted-foreground text-sm">
                Allow others to see your performance metrics such as realised
                profit/loss, current value, etc
              </p>
            </div>
            <Switch
              checked={showMetrics}
              onCheckedChange={(value) => setShowMetrics(value)}
            />
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
                    onClick={() => handleDeleteAccount()}
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
