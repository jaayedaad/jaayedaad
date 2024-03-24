"use client";
import { Bell, UserRound } from "lucide-react";
import Preferences from "@/components/preferences";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AccountSettings from "@/components/accountSettings";
import { Preference } from "@prisma/client";
import { getPreferences } from "@/actions/getPreferencesAction";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { getCurrentUser } from "@/actions/getCurrentUser";

function SettingsPage() {
  const { data: session } = useSession();
  const [selectedOption, setSelectedOption] = useState("Preferences");
  const [preferences, setPreferences] = useState<{
    id: string;
    publicProfile: boolean;
    defaultCurrency: string;
    numberSystem: string;
    showHoldings: boolean;
    showMetrics: boolean;
    performanceBarOrder: string;
    userId: string;
  }>();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    getPreferences().then((preferences: Preference) => {
      setPreferences(preferences);
    });
    getCurrentUser().then((res) => {
      if (res?.userData) {
        setUsername(res.userData.username);
      }
    });
  }, []);

  return (
    session && (
      <div className="py-6 px-6 w-full">
        <div>
          <div className="text-muted-foreground flex gap-1 mb-4">
            <Button
              variant="ghost"
              className={cn(
                `w-full justify-start`,
                selectedOption === "Preferences" &&
                  "bg-secondary hover:bg-primary/20 text-primary"
              )}
              onClick={() => setSelectedOption("Preferences")}
            >
              <Bell className="mr-2" /> Preferences
            </Button>
            <Button
              variant="ghost"
              className={cn(
                `w-full justify-start`,
                selectedOption === "Account" &&
                  "bg-secondary hover:bg-primary/20 text-primary"
              )}
              onClick={() => setSelectedOption("Account")}
            >
              <UserRound className="mr-2" /> Account
            </Button>
          </div>
          {preferences ? (
            <div className="w-full mr-28">
              {selectedOption === "Preferences" && (
                <Preferences
                  preferences={preferences}
                  setPreferences={setPreferences}
                />
              )}
              {selectedOption === "Account" && username !== null && (
                <AccountSettings
                  username={username}
                  preferences={preferences}
                  setPreferences={setPreferences}
                />
              )}
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    )
  );
}

export default SettingsPage;
