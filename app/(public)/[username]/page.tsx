"use client";
import { getUserByUsername } from "@/actions/getUserByUsernameAction";
import Profile from "@/components/profile/profile";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Preference } from "@prisma/client";
import { useEffect, useState } from "react";

function PublicProfilePage({ params }: { params: { username: string } }) {
  const [userId, setUserId] = useState<string | null>();
  const [publicVisibility, setPublicVisibility] = useState<boolean>();
  const [preferences, setPreferences] = useState<Preference>();

  useEffect(() => {
    getUserByUsername(params.username).then((user) => {
      if (user && user.preferences) {
        setUserId(user.id);
        const publicVisibility = user.preferences.publicVisibility;
        setPublicVisibility(publicVisibility);
        setPreferences(user.preferences);
      }
    });
  }, [params.username]);

  return (
    <div className="h-screen">
      {userId === undefined ? (
        <LoadingSpinner />
      ) : userId ? (
        publicVisibility ? (
          <div className="h-full">
            {preferences && <Profile preferences={preferences} />}
          </div>
        ) : (
          <div className="text-4xl font-mona-sans flex items-center justify-center h-full">
            This user hasn&apos;t made their profile public
          </div>
        )
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="flex gap-6 h-20 items-center">
            <h1 className="text-4xl font-mona-sans">404</h1>
            <Separator orientation="vertical" className="bg-primary/50" />
            <h1 className="text-4xl font-mona-sans">No such user exist!</h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicProfilePage;
