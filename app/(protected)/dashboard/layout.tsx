import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import React from "react";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user.username) {
    redirect("/auth/onboarding");
  }
  return <main>{children}</main>;
}

export default DashboardLayout;
