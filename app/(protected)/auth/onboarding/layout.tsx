import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col my-14 px-12">
      <div className="py-6 text-center">
        <h1 className="text-5xl font-bold">Claim your username</h1>
        <p className="text-muted-foreground pt-1">
          This is what we&apos;ll be using as your display name. You can change it later if it&apos;s available.
        </p>
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}

export default Layout;
