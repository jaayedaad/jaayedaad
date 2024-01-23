import Navbar from "@/components/navbar";
import React from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Navbar />

      {children}
    </div>
  );
}

export default DashboardLayout;
