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
import { Toggle } from "./ui/toggle";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import AddTransaction from "./addTransaction";

function BottomBar() {
  const currentTab = decodeURIComponent(usePathname());
  const { user } = useData();
  const { visible, setVisible } = useVisibility();
  const [open, setOpen] = useState(false);

  const uniqueCategorySet = new Set<string>();
  user?.usersManualCategories.forEach((category) => {
    if (category.assets) {
      category.assets.forEach((asset) => {
        if (+asset.quantity !== 0) {
          uniqueCategorySet.add(asset.type);
        }
      });
    }
  });
  const manualCategoryList = Array.from(uniqueCategorySet);
  return (
    <div className="w-full px-6 sm:px-12 pb-4 fixed bottom-0 flex gap-1 bg-background sm:gap-6 h-16 md:h-20 justify-between lg:hidden">
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
          {/* Dashboard */}
        </Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        className={cn(
          `w-full h-full`,
          currentTab === "/dashboard/common stock" &&
            "bg-secondary text-foreground hover:bg-primary/20"
        )}
      >
        <Link href="/dashboard/common stock">
          <CandlestickChart size={20} />
          {/* Stocks */}
        </Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        className={cn(
          `w-full h-full`,
          currentTab === "/dashboard/digital currency" &&
            "bg-secondary text-foreground hover:bg-primary/20"
        )}
      >
        <Link href="/dashboard/digital currency">
          <Bitcoin size={20} />
          {/* Crypto */}
        </Link>
      </Button>
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
        asChild
        variant="ghost"
        className={cn(
          `w-full h-full`,
          currentTab === "/dashboard/mutual fund" &&
            "bg-secondary text-foreground hover:bg-primary/20"
        )}
      >
        <Link href="/dashboard/mutual fund">
          <SquareStack size={20} />
          {/* Mutual Funds */}
        </Link>
      </Button>
      {manualCategoryList.map((category) => {
        return (
          <Button
            key={category}
            asChild
            variant="ghost"
            className={cn(
              `w-full h-full`,
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
              {/* {category.charAt(0).toUpperCase() +
                category.slice(1).toLowerCase()} */}
            </Link>
          </Button>
        );
      })}
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
      {/* <div className="flex items-center justify-between"> */}
      {/* <p className="text-sm">{visible ? "Public" : "Private"} mode</p> */}
      {/* <Toggle onPressedChange={() => setVisible(!visible)}>
        {visible ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
      </Toggle> */}
      {/* </div> */}
    </div>
  );
}

export default BottomBar;
