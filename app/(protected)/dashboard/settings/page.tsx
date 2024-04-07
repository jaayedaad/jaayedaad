import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getPreferenceFromUserId } from "@/services/preference";
import PublicProfileSettings from "@/components/publicProfileSettings";
import PreferenceComponent from "@/components/preference";
import AccountSettings from "@/components/accountSettings";

export default async function Settings() {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    redirect("/auth/signin");
  }

  const preference = await getPreferenceFromUserId(session.user.id);
  if (!preference) {
    throw new Error("Preference not found");
  }

  return (
    <div className="pb-6 pt-12 px-6 w-full h-screen overflow-auto ">
      <div>
        <div className="text-muted-foreground flex gap-1 mb-4">
          <div className="flex flex-col w-full gap-6">
            <PublicProfileSettings preference={preference} />
            <PreferenceComponent preference={preference} />
            <AccountSettings username={session.user.username} />
          </div>
        </div>
      </div>
    </div>
  );
}
