"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import {
  Bitcoin,
  CandlestickChart,
  EyeIcon,
  EyeOffIcon,
  Home,
  LogOut,
  SquareStack,
  UserIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { User } from "@prisma/client";
import { Toggle } from "./ui/toggle";
import { useVisibility } from "@/contexts/visibility-context";

function Sidebar() {
  const currentTab = usePathname();
  const { visible, setVisible } = useVisibility();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getCurrentUser().then((user: User) => setUser(user));
  }, []);
  return (
    <div className="py-6 px-4 border-r h-screen w-fit">
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-1 text-muted-foreground">
          <Button
            asChild
            variant="ghost"
            className={cn(
              `w-full justify-start`,
              currentTab === "/dashboard" &&
                "bg-secondary text-foreground hover:bg-primary/20"
            )}
          >
            <Link href="/dashboard">
              <Home className="mr-2" size={20} />
              Dashboard
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              `w-full justify-start`,
              currentTab === "/dashboard/stocks" &&
                "bg-secondary text-foreground hover:bg-primary/20"
            )}
          >
            <Link href="/dashboard/stocks">
              <CandlestickChart className="mr-2" size={20} />
              Stocks
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              `w-full justify-start`,
              currentTab === "/dashboard/crypto" &&
                "bg-secondary text-foreground hover:bg-primary/20"
            )}
          >
            <Link href="/dashboard/crypto">
              <Bitcoin className="mr-2" size={20} />
              Crypto
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              `w-full justify-start`,
              currentTab === "/dashboard/funds" &&
                "bg-secondary text-foreground hover:bg-primary/20"
            )}
          >
            <Link href="/dashboard/funds">
              <SquareStack className="mr-2" size={20} />
              Funds
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              `w-full justify-start`,
              currentTab === `/dashboard/profile/${user?.username}` &&
                "bg-secondary text-foreground hover:bg-primary/20"
            )}
          >
            <Link href={`/dashboard/profile/${user?.username}`}>
              <UserIcon className="mr-2" size={20} /> Profile
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            Safe mode
            <Toggle onPressedChange={() => setVisible(!visible)}>
              {visible ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeOffIcon className="h-4 w-4" />
              )}
            </Toggle>
          </div>
          <Button
            className="w-full justify-start"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut size={20} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
