"use client";
import { useData } from "@/contexts/data-context";
import { useVisibility } from "@/contexts/visibility-context";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
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

function BottomBar() {
  const currentTab = decodeURIComponent(usePathname());
  const { user } = useData();
  const { visible, setVisible } = useVisibility();
  const [open, setOpen] = useState(false);

  const uniqueCategorySet = new Set<string>();
  user?.usersManualCategories.forEach((category) =>
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
                  "bg-secondary text-foreground hover:bg-primary/20"
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
                  "bg-secondary text-foreground hover:bg-primary/20"
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
                currentTab === "/dashboard/mutual fund" &&
                  "bg-secondary text-foreground hover:bg-primary/20"
              )}
            >
              <Link href="/dashboard/mutual fund">
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
                      "bg-secondary text-foreground hover:bg-primary/20"
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

      <Button
        className="w-full h-full"
        variant="ghost"
        onClick={() => setVisible(!visible)}
      >
        {visible ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
      </Button>
      <Button
        asChild
        variant="ghost"
        className={cn(
          `w-full h-full`,
          currentTab === "/dashboard/settings" &&
            "bg-secondary text-foreground hover:bg-primary/20"
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
