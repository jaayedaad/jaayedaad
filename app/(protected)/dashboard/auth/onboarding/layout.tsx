import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col py-2 px-12">
      <div className="py-10 text-center">
        <h1 className="text-5xl font-bold">Set your username</h1>
        <p className="text-muted-foreground pt-1">
          This is what we&apos;ll be using as your display name
        </p>
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}

export default Layout;
