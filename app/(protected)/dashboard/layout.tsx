import { getCurrentUser } from "@/actions/getCurrentUser";
import Sidebar from "@/components/sidebar";
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
      {children}
    </main>
  );
}

export default DashboardLayout;
