import CurrencyProvider from "@/contexts/currency-context";
import DataProvider from "@/contexts/data-context";
import VisibilityProvider from "@/contexts/visibility-context";
import React from "react";

async function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <VisibilityProvider>
      <CurrencyProvider>{children}</CurrencyProvider>
    </VisibilityProvider>
  );
}

export default ProfileLayout;
