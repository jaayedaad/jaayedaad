"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Bitcoin,
  CandlestickChart,
  EyeIcon,
  EyeOffIcon,
  Home,
  Plus,
  Settings,
  SquareStack,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/helper";
import Link from "next/link";
import { Toggle } from "./ui/toggle";
import { useVisibility } from "@/contexts/visibility-context";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import AddTransaction from "./addTransaction";
import { useData } from "@/contexts/data-context";
import jaayedaad_logo from "@/public/jaayedaad_logo.svg";
import Image from "next/image";
import CreateCategoryButton from "./createCategoryButton";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import DynamicIcon from "./dynamicIcon";
import JaayedaadLogo from "@/public/branding/jaayedaadLogo";

function Sidebar() {
  const currentTab = decodeURIComponent(usePathname());
  const { user } = useData();
  const [open, setOpen] = useState(false);

  const uniqueCategorySet = new Set<{
    name: string;
    icon: keyof typeof dynamicIconImports;
  }>();
  user?.usersManualCategories.forEach((category) => {
    uniqueCategorySet.add({
      name: category.name,
      icon: category.icon,
    });
  });
  const manualCategoryList = Array.from(uniqueCategorySet);

  return (
    <div className="hidden lg:block py-6 px-4 border-r lg:h-screen w-fit">
      <div className="flex flex-col justify-between lg:h-full xl:h-full">
        <div className="flex flex-col gap-1 text-muted-foreground">
          {/* <Image
            src={jaayedaad_logo}
            alt="Jaayedaad logo"
            className="h-10 mb-2"
          /> */}
          <div className="h-8 mb-4">
            <JaayedaadLogo />
          </div>
          <Button
            asChild
            className={cn(
              `w-full justify-start pr-8 bg-background hover:bg-primary/10`,
              currentTab === "/dashboard" &&
                "bg-primary/20 text-foreground hover:bg-primary/30"
            )}
          >
            <Link href="/dashboard">
              <Home className="mr-2" size={20} />
              Dashboard
            </Link>
          </Button>
          <Button
            asChild
            className={cn(
              `w-full justify-start pr-8 bg-background hover:bg-primary/10`,
              currentTab === "/dashboard/stocks" &&
                "bg-primary/20 text-foreground hover:bg-primary/30"
            )}
          >
            <Link href="/dashboard/stocks">
              <CandlestickChart className="mr-2" size={20} />
              Stocks
            </Link>
          </Button>
          <Button
            asChild
            className={cn(
              `w-full justify-start pr-8 bg-background hover:bg-primary/10`,
              currentTab === "/dashboard/crypto" &&
                "bg-primary/20 text-foreground hover:bg-primary/30"
            )}
          >
            <Link href="/dashboard/crypto">
              <Bitcoin className="mr-2" size={20} />
              Crypto
            </Link>
          </Button>
          <Button
            asChild
            className={cn(
              `w-full justify-start pr-8 bg-background hover:bg-primary/10`,
              currentTab === "/dashboard/mutual fund" &&
                "bg-primary/20 text-foreground hover:bg-primary/30"
            )}
          >
            <Link href="/dashboard/mutual fund">
              <SquareStack className="mr-2" size={20} />
              Mutual Funds
            </Link>
          </Button>
          {manualCategoryList.map((category) => {
            return (
              <Button
                key={category.name}
                asChild
                className={cn(
                  `w-full justify-start pr-8 bg-background hover:bg-primary/10`,
                  currentTab === `/dashboard/${category.name.toLowerCase()}` &&
                    "bg-primary/20 text-foreground hover:bg-primary/30"
                )}
              >
                <Link href={`/dashboard/${category.name.toLowerCase()}`}>
                  <DynamicIcon
                    name={category.icon}
                    className="mr-2"
                    size={20}
                  />
                  {category.name.charAt(0).toUpperCase() +
                    category.name.slice(1).toLowerCase()}
                </Link>
              </Button>
            );
          })}
          <CreateCategoryButton />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <Button
              asChild
              className={cn(
                `w-full justify-start pr-8 bg-background hover:bg-primary/10`,
                currentTab === "/dashboard/settings" &&
                  "bg-primary/20 text-foreground hover:bg-primary/30"
              )}
            >
              <Link href={"/dashboard/settings"}>
                <Settings className="mr-2" size={20} /> Settings
              </Link>
            </Button>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="justify-start w-fit xl:pr-8">
                <Plus className="mr-2" size={20} /> Add transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] md:max-w-[50vw] md:max-h-[80vh]">
              <div className="md:flex md:gap-2">
                <DialogTitle>Make transactions</DialogTitle>
                <p className="text-muted-foreground text-sm">
                  Add transactions to your portfolio
                </p>
              </div>
              <AddTransaction handleModalState={setOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
