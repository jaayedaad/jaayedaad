import React from "react";
import { SignedIn } from "@/components/auth/SignedIn";
import { SignedOut } from "@/components/auth/SignedOut";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";

function Navbar() {
  return (
    <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
      <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        Investment Tracker
      </p>

      <SignedOut>
        <button
          onClick={() => signIn("google")}
          className="bg-white px-4 py-2 text-black rounded-md hover:cursor-pointer hover:bg-white/90"
        >
          Sign In
        </button>
      </SignedOut>
      <SignedIn>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/my-assets">My assets</Link>
          </Button>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      </SignedIn>
    </div>
  );
}

export default Navbar;
