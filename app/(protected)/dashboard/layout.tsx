import { getCurrentUser } from "@/actions/getCurrentUser";
import Sidebar from "@/components/sidebar";
import CurrencyProvider from "@/contexts/currency-context";
import DataProvider from "@/contexts/data-context";
import VisibilityProvider from "@/contexts/visibility-context";
import { redirect } from "next/navigation";
import React from "react";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userResponse = await getCurrentUser();
  if (!userResponse?.userData.username) {
    redirect("/auth/onboarding");
  }
  return (
    <main className="flex">
      <VisibilityProvider>
        <DataProvider>
          <CurrencyProvider>
            <Sidebar />
            {children}
          </CurrencyProvider>
        </DataProvider>
      </VisibilityProvider>
    </main>
  );
}

export default DashboardLayout;
