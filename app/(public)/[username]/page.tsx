"use client";
import { getUserByUsername } from "@/actions/getUserByUsernameAction";
import { useEffect, useState } from "react";

function PublicProfilePage({ params }: { params: { username: string } }) {
  const [publicProfile, setPublicProfile] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    getUserByUsername(params.username).then((user) => {
      const publicProfile = user?.preferences[0].publicProfile;
      setPublicProfile(publicProfile);
    });
  }, [params.username]);

  return (
    <div className="mt-14 pt-6 px-12">
      {publicProfile ? (
        <div>{params.username}&apos;s public profile page</div>
      ) : (
        <div>This user hasn&apos;t made their profile public</div>
      )}
    </div>
  );
}

export default PublicProfilePage;
