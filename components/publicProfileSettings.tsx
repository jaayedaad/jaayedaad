"use client";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "./ui/loading-spinner";
import { TPreference } from "@/lib/types";
import { updatePreferenceAction } from "@/app/(protected)/dashboard/settings/actions";

interface ProfileSettingsProps {
  preference: TPreference;
}

function PublicProfileSettings({
  preference: preferences,
}: ProfileSettingsProps) {
  const [publicVisibility, setPublicVisibility] = useState(
    preferences.publicVisibility
  );
  const [showHoldingsInPublic, setShowHoldingsInPublic] = useState(
    preferences.showHoldingsInPublic
  );
  const [showMetricsInPublic, setShowMetricsInPublic] = useState(
    preferences.showMetricsInPublic
  );

  const handleSave = async <T extends keyof typeof preferences>(
    key: T,
    value: (typeof preferences)[T]
  ) => {
    try {
      const updatedPreferences = {
        ...preferences,
        [key]: value,
      };
      await updatePreferenceAction(updatedPreferences);
      toast.success("Preferences updated successfully!");
      window.location.reload();
    } catch {
      toast.error("Failed to update preferences");
    }
  };
  return (
    <>
      <div className="flex justify-between">
        <div>
          <h2 className="text-3xl text-foreground font-bold">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Configure your your public visibilities
          </p>
        </div>
      </div>
      <Separator />

      <div className="flex flex-col gap-4">
        <div className="py-5 px-4 flex items-center justify-between border rounded-lg w-full">
          <div>
            <h2 className="text-foreground">Public profile</h2>
            <p className="text-muted-foreground text-sm">
              Toggle your public profile visibility
            </p>
          </div>
          <Switch
            checked={publicVisibility}
            onCheckedChange={(value) => {
              setPublicVisibility(value);
              handleSave("publicVisibility", value);
            }}
          />
        </div>
        <div className="py-5 px-4 flex gap-2 items-center justify-between border rounded-lg w-full">
          <div>
            <h2 className="text-foreground">Holdings</h2>
            <p className="text-muted-foreground text-sm">
              Allow others to see your portfolio holdings on your public profile
              page
            </p>
          </div>
          <Switch
            checked={showHoldingsInPublic}
            onCheckedChange={(value) => {
              setShowHoldingsInPublic(value);
              handleSave("showHoldingsInPublic", value);
            }}
          />
        </div>
        <div className="py-5 px-4 flex gap-2 items-center justify-between border rounded-lg w-full">
          <div>
            <h2 className="text-foreground">Portfolio metrics</h2>
            <p className="text-muted-foreground text-sm">
              Allow others to see your performance metrics such as realised
              profit/loss, current value, etc
            </p>
          </div>
          <Switch
            checked={showMetricsInPublic}
            onCheckedChange={(value) => {
              setShowMetricsInPublic(value);
              handleSave("showMetricsInPublic", value);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default PublicProfileSettings;
