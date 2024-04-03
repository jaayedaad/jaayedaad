"use client";
import { Loader2, MoveUpRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getUserByUsername } from "@/actions/getUserByUsernameAction";
import { cn } from "@/lib/helper";
import { signIn } from "next-auth/react";

function ClaimUsername() {
  const [username, setUsername] = useState<string>("");
  const [available, setAvailable] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);

  // Check for availability of username
  const verifyUsername = async (username: string) => {
    const regex = /^[a-zA-Z0-9_]+$/; // regular expression for alphanumeric characters & underscores
    if (!regex.test(username)) {
      setErrorMessage("Letters, numbers, or underscores only!");
      return;
    } else if (username.length < 3) {
      setErrorMessage("Username must be at least 3 characters!");
      return;
    }
    const data = await getUserByUsername(username);
    if (!data) {
      setErrorMessage("Username available");
      setAvailable(true);
      setDisabled(false);
    } else {
      setErrorMessage("This username is already taken");
    }
  };

  // Accomodates live username change
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (username) {
        if (username.trim() !== "") {
          verifyUsername(username);
        }
      } else {
        setErrorMessage("");
        setAvailable(true);
        setDisabled(true);
      }
    }, 1000);

    // Clear the timer on each change
    return () => clearTimeout(timerId);
  }, [username]);

  // handles username field and disables button while typing
  const handleUsernameChange = (value: string) => {
    setErrorMessage("");
    setAvailable(false);
    setUsername(value);
    setDisabled(true);
  };

  const handleClaimUsername = async () => {
    // Store the username in local storage
    localStorage.setItem("claimedUsername", username);
  };

  return (
    <div className="flex justify-center text-center pt-4">
      <div className="text-primary-foreground lg:px-4">
        <div className="flex mt-4 justify-center">
          <div className="pl-4 pr-0 py-2 text-base md:text-[16px] rounded-l-full font-mona-sans border border-r-0 border-zinc-600 flex items-center">
            jaayedaad.com/
          </div>
          <Input
            value={username}
            placeholder="Shubham"
            className="pl-0 py-6 font-mona-sans border-x-0 rounded-none text-base md:text-[16px] border-zinc-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e) => handleUsernameChange(e.target.value)}
          />
          <div className="pr-1 rounded-r-full border border-l-0 border-zinc-600 flex items-center">
            <Button
              className={cn(
                "hidden md:inline-flex px-4 py-4 border rounded-full border-zinc-600 disabled:pointer-events-auto disabled:hover:cursor-not-allowed",
                available
                  ? "bg-gradient-to-r from-violet-950 to-primary disabled:opacity-100"
                  : "bg-gray-600 disabled:hover:bg-gray-600 disabled:opacity-80"
              )}
              disabled={disabled}
              onClick={() => {
                handleClaimUsername();
                signIn("google");
              }}
            >
              {!available && errorMessage === "" && (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              )}
              {available
                ? "Claim username!"
                : errorMessage.includes("taken")
                ? "Username taken"
                : errorMessage.includes("!")
                ? "Invalid format"
                : "Checking Availability"}
            </Button>
            <Button
              className={cn(
                "md:hidden px-4 py-4 border rounded-full border-zinc-600 disabled:pointer-events-auto disabled:hover:cursor-not-allowed",
                available
                  ? "bg-gradient-to-r from-violet-950 to-primary disabled:opacity-100"
                  : "bg-gray-600 disabled:hover:bg-gray-600 disabled:opacity-80"
              )}
              disabled={disabled}
              onClick={() => {
                handleClaimUsername();
                signIn("google");
              }}
            >
              {!available && errorMessage === "" && (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              )}
              Claim
            </Button>
          </div>
        </div>
        <div className="flex">
          <Button
            variant="secondary"
            className="invisible rounded-l-full pr-0 pl-4 py-2 text-base"
          >
            jaayedaad.com/
          </Button>
          <p
            className={cn(
              "text-sm pt-1.5 px-2 pl-0",
              errorMessage.includes("available")
                ? "text-green-400"
                : "text-red-400"
            )}
          >
            {errorMessage.includes("taken") ? "Try another one!" : errorMessage}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClaimUsername;
