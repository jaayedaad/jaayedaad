"use client";
import { Bell, UserRound } from "lucide-react";
import Preferences from "@/components/preferences";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helper";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AccountSettings from "@/components/accountSettings";
import { Preference } from "@prisma/client";
import { getPreferences } from "@/actions/getPreferencesAction";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { getCurrentUser } from "@/actions/getCurrentUser";
import ProfileSettings from "@/components/profileSettings";

function SettingsPage() {
  const { data: session } = useSession();
  const [selectedOption, setSelectedOption] = useState("Preferences");
  const [preferences, setPreferences] = useState<Preference>();
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
      <div className="py-6 px-6 w-full h-screen overflow-auto ">
        <div>
          <div className="text-muted-foreground flex gap-1 mb-4">
            {preferences && username ? (
              <div className="flex flex-col w-full gap-6">
                <ProfileSettings
                  preferences={preferences}
                  setPreferences={setPreferences}
                />
                <Preferences
                  preferences={preferences}
                  setPreferences={setPreferences}
                />
                <AccountSettings
                  username={username}
                  preferences={preferences}
                  setPreferences={setPreferences}
                />
              </div>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default SettingsPage;
