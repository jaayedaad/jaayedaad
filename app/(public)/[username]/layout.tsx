import { getUserByUsername } from "@/services/user";
import { redirect } from "next/navigation";
import React from "react";

async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const user = await getUserByUsername(params.username);
  if (!user) {
    redirect("/");
  }

  return <>{children}</>;
}

export default ProfileLayout;
