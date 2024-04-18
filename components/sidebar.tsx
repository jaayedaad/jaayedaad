"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Bitcoin,
  CandlestickChart,
  Home,
  Plus,
  Settings,
  SquareStack,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/helper";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import AddTransaction from "./addTransaction";
import CreateCategoryButton from "./createCategoryButton";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import DynamicIcon from "./dynamicIcon";
import JaayedaadLogo from "@/public/branding/jaayedaadLogo";
import { TUserManualCategory } from "@/types/types";

function Sidebar({
  usersManualCategories,
  defaultCurrency,
}: {
  usersManualCategories: TUserManualCategory[];
  defaultCurrency: string;
}) {
  const currentTab = decodeURIComponent(usePathname());
  const [open, setOpen] = useState(false);

  const uniqueCategorySet = new Set<{
    name: string;
    icon: keyof typeof dynamicIconImports;
  }>();
  usersManualCategories.forEach((category) => {
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
          <div className="h-8 mb-6 flex justify-center">
            <JaayedaadLogo />
          </div>
          <Button
            asChild
            className={cn(
              `w-full justify-start pr-8 bg-background hover:bg-primary/10`,
              currentTab === "/dashboard" &&
                "bg-[#171326]/70 border text-foreground hover:bg-primary/30"
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
                "bg-[#171326]/70 border text-foreground hover:bg-primary/30"
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
                "bg-[#171326]/70 border text-foreground hover:bg-primary/30"
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
              currentTab === "/dashboard/mutual funds" &&
                "bg-[#171326]/70 border text-foreground hover:bg-primary/30"
            )}
          >
            <Link href="/dashboard/mutual funds">
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
                    "bg-[#171326]/70 border text-foreground hover:bg-primary/30"
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
                  "bg-[#171326]/70 border text-foreground hover:bg-primary/30"
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
            <DialogContent className="w-[90vw] ">
              <div className="md:flex md:gap-2">
                <DialogTitle>Make transactions</DialogTitle>
                <p className="text-muted-foreground text-sm">
                  Add transactions to your portfolio
                </p>
              </div>
              <AddTransaction
                usersManualCategories={usersManualCategories}
                handleModalState={setOpen}
                defaultCurrency={defaultCurrency}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
