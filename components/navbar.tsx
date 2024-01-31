"use client";
import { SignedIn } from "@/components/auth/SignedIn";
import { SignedOut } from "@/components/auth/SignedOut";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { getCurrentUser } from "@/actions/getCurrentUser";

function Navbar() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getCurrentUser().then((user: User) => setUser(user));
  }, []);

  return (
    <div className="z-10 fixed left-0 top-0 flex w-full items-center justify-between border-b border-gray-300 bg-gradient-to-b from-zinc-200 py-2 px-12 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
      <div>Investment Tracker</div>
      <div>
        <SignedOut>
          <Button
            onClick={() =>
              signIn("google", {
                callbackUrl: "http://localhost:3000/dashboard",
              })
            }
          >
            Sign In
          </Button>
        </SignedOut>
        <SignedIn>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <Button asChild variant="link">
                <Link href={`/dashboard/profile/${user?.username}`}>
                  Profile
                </Link>
              </Button>
              <Button asChild variant="link">
                <Link href="/dashboard/portfolio/add">Add assets</Link>
              </Button>
              <Button asChild variant="link">
                <Link href="/dashboard/portfolio/browse">My assets</Link>
              </Button>
            </div>
            <Button onClick={() => signOut()}>Sign Out</Button>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}

export default Navbar;
