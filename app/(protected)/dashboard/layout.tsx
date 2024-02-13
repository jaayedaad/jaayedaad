import { getCurrentUser } from "@/actions/getCurrentUser";
import Sidebar from "@/components/sidebar";
import DataProvider from "@/contexts/data-context";
import { redirect } from "next/navigation";
import React from "react";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user.username) {
    redirect("/auth/onboarding");
  }
  return (
    <main className="flex">
      <Sidebar />
      <DataProvider>{children}</DataProvider>
    </main>
  );
}

export default DashboardLayout;
