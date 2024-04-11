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
    redirect("/");
  }

  const preference = await getPreferenceFromUserId(session.user.id);
  if (!preference) {
    throw new Error("Preference not found");
  }

  return (
    <div className="mb-20 md:mb-24 lg:mb-0 py-6 px-6 w-full h-screen overflow-auto">
      <div>
        <div className="text-muted-foreground flex gap-1">
          <div className="flex flex-col w-full gap-2">
            <PublicProfileSettings preference={preference} />
            <PreferenceComponent preference={preference} />
            <AccountSettings username={session.user.username} />
          </div>
        </div>
      </div>
    </div>
  );
}
