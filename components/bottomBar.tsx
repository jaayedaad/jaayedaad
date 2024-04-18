"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/helper";
import Link from "next/link";
import {
  Bitcoin,
  CandlestickChart,
  EyeIcon,
  EyeOffIcon,
  Gem,
  Home,
  LandPlot,
  Landmark,
  Plus,
  Settings,
  Shapes,
  SquareStack,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddTransaction from "./addTransaction";
import { TUserManualCategory } from "@/types/types";
import { updatePreferenceAction } from "@/app/(protected)/dashboard/settings/actions";

function BottomBar({
  dashboardAmountVisibility,
  usersManualCategories,
  defaultCurrency,
}: {
  dashboardAmountVisibility: boolean;
  usersManualCategories: TUserManualCategory[];
  defaultCurrency: string;
}) {
  const [amountVisibility, setAmountVisibility] = useState(
    dashboardAmountVisibility
  );
  const currentTab = decodeURIComponent(usePathname());
  const [open, setOpen] = useState(false);

  const uniqueCategorySet = new Set<string>();
  usersManualCategories.forEach((category) =>
    uniqueCategorySet.add(category.name)
  );
  const manualCategoryList = Array.from(uniqueCategorySet);
  return (
    <div className="w-full px-6 sm:px-12 py-4 fixed bottom-0 flex gap-2 bg-background border-t sm:gap-6 h-20 md:h-24 justify-between lg:hidden">
      {/* dashboard */}
      <Button
        asChild
        variant="ghost"
        className={cn(
          `w-full h-full`,
          currentTab === "/dashboard" &&
            "bg-secondary text-foreground hover:bg-primary/20"
        )}
      >
        <Link href="/dashboard">
          <Home size={20} />
        </Link>
      </Button>

      {/* categories */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full h-full" variant="ghost">
            <Shapes size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="pl-6">View</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* stocks */}
          <DropdownMenuItem>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-1",
                currentTab === "/dashboard/stocks" &&
                  "bg-[#171326]/70 text-foreground hover:bg-primary/30"
              )}
            >
              <Link href="/dashboard/stocks">
                <CandlestickChart size={20} />
                Stocks
              </Link>
            </Button>
          </DropdownMenuItem>
          {/* crypto */}
          <DropdownMenuItem>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-1",
                currentTab === "/dashboard/crypto" &&
                  "bg-[#171326]/70 text-foreground hover:bg-primary/30"
              )}
            >
              <Link href="/dashboard/crypto">
                <Bitcoin size={20} />
                Crypto
              </Link>
            </Button>
          </DropdownMenuItem>
          {/* mutual fund */}
          <DropdownMenuItem>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-1",
                currentTab === "/dashboard/mutual funds" &&
                  "bg-[#171326]/70 text-foreground hover:bg-primary/30"
              )}
            >
              <Link href="/dashboard/mutual funds">
                <SquareStack size={20} />
                Mutual Funds
              </Link>
            </Button>
          </DropdownMenuItem>
          {/* other categories */}
          {manualCategoryList.map((category) => {
            return (
              <DropdownMenuItem key={category}>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-1",
                    currentTab === `/dashboard/${category.toLowerCase()}` &&
                      "bg-[#171326]/70 text-foreground hover:bg-primary/30"
                  )}
                >
                  <Link href={`/dashboard/${category.toLowerCase()}`}>
                    {category === "Property" ? (
                      <LandPlot size={20} />
                    ) : category === "Jewellery" ? (
                      <Gem size={20} />
                    ) : category === "Deposits" ? (
                      <Landmark size={20} />
                    ) : (
                      <Shapes size={20} />
                    )}
                    {category.charAt(0).toUpperCase() +
                      category.slice(1).toLowerCase()}
                  </Link>
                </Button>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Make transaction button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="h-full rounded-full p-0 aspect-square">
            <Plus className="h-6 w-6" />
            {/* Add transaction */}
          </Button>
        </DialogTrigger>
        <DialogContent className="p-4 md:p-6 w-[90vw] md:max-w-[50vw] max-h-[95vh] overflow-auto rounded-lg">
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

      <Button
        className="w-full h-full"
        variant="ghost"
        onClick={async () => {
          setAmountVisibility(!amountVisibility);
          await updatePreferenceAction({
            dashboardAmountVisibility: !amountVisibility,
          });
        }}
      >
        {amountVisibility ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
      </Button>
      <Button
        asChild
        variant="ghost"
        className={cn(
          `w-full h-full`,
          currentTab === "/dashboard/settings" &&
            "bg-[#171326]/70 text-foreground hover:bg-primary/30"
        )}
      >
        <Link href={`/dashboard/settings`}>
          <Settings size={20} />
          {/* Settings */}
        </Link>
      </Button>
    </div>
  );
}

export default BottomBar;
