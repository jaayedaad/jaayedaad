"use client";
import { Asterisk, Bell, UserRound } from "lucide-react";
import Preferences from "@/components/preferences";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AccountSettings from "@/components/accountSettings";
import { Preference } from "@prisma/client";
import { getPreferences } from "@/actions/getPreferencesAction";
import LoadingSpinner from "@/components/ui/loading-spinner";

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
    userId: string;
  }>();

  useEffect(() => {
    getPreferences().then((preferences: Preference) => {
      setPreferences(preferences);
    });
  }, []);

  return (
    session && (
      <div className="py-6 px-6 w-full">
        <div className="text-5xl font-bold flex items-center gap-4 py-4">
          Settings <Asterisk />
          <Image
            src={session?.user?.image!}
            alt="Profile picture"
            height={64}
            width={64}
            className="rounded-full border-2 border-foreground"
            priority
          />
        </div>
        <div className="flex mt-4">
          <div className="text-muted-foreground flex flex-col gap-1 mx-16 w-52 min-w-fit">
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
              {selectedOption === "Account" && (
                <AccountSettings
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
