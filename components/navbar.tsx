"use client";
import { SignedIn } from "@/components/auth/SignedIn";
import { SignedOut } from "@/components/auth/SignedOut";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";

function Navbar() {
  return (
    <div className="z-10 fixed left-0 top-0 flex w-full items-center justify-between border-b border-gray-300 bg-gradient-to-b from-zinc-200 py-2 px-12 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
      <div>Investment Tracker</div>
      <div>
        <SignedOut>
          <Button
            onClick={() =>
              signIn("google", {
                callbackUrl: "/dashboard",
              })
            }
          >
            Sign In
          </Button>
        </SignedOut>
        <SignedIn>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/dashboard/">Dashboard</Link>
              </Button>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}

export default Navbar;
