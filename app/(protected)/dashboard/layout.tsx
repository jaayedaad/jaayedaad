import BottomBar from "@/components/bottomBar";
import Sidebar from "@/components/sidebar";
import { authOptions } from "@/lib/authOptions";
import { getPreferenceFromUserId } from "@/services/preference";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    redirect("/auth/signin");
  }

  const preference = await getPreferenceFromUserId(session.user.id);
  if (!preference) {
    throw new Error("Preference not found");
  }

  return (
    <>
      <main className="flex">
        <Sidebar
          usersManualCategories={session.user.usersManualCategories}
          defaultCurrency={preference.defaultCurrency}
        />
        {children}
      </main>
      <BottomBar
        usersManualCategories={session.user.usersManualCategories}
        dashboardAmountVisibility={preference.dashboardAmountVisibility}
        defaultCurrency={preference.defaultCurrency}
      />
    </>
  );
}

export default DashboardLayout;
