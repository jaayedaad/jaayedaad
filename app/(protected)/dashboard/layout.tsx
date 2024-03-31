import BottomBar from "@/components/bottomBar";
import Sidebar from "@/components/sidebar";
import CurrencyProvider from "@/contexts/currency-context";
import DataProvider from "@/contexts/data-context";
import VisibilityProvider from "@/contexts/visibility-context";
import { redirect } from "next/navigation";
import React from "react";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <VisibilityProvider>
      <DataProvider>
        <CurrencyProvider>
          <main className="flex">
            <Sidebar />
            {children}
          </main>
          <BottomBar />
        </CurrencyProvider>
      </DataProvider>
    </VisibilityProvider>
  );
}

export default DashboardLayout;
