"use client";
import { Asterisk, Bell, UserRound } from "lucide-react";
import Preferences from "@/components/preferences";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

function SettingsPage() {
  const [selectedOption, setSelectedOption] = useState("Preferences");
  const { data: session } = useSession();
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
                  "bg-secondary hover:bg-primary/20"
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
                  "bg-secondary hover:bg-primary/20"
              )}
              onClick={() => setSelectedOption("Account")}
            >
              <UserRound className="mr-2" /> Account
            </Button>
          </div>
          <div className="w-full mr-28">
            {selectedOption === "Preferences" && <Preferences />}
            {selectedOption === "Account" && <div>Account settings</div>}
          </div>
        </div>
      </div>
    )
  );
}

export default SettingsPage;
