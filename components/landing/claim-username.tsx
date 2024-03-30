"use client";
import { MoveUpRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getUserByUsername } from "@/actions/getUserByUsernameAction";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

function ClaimUsername() {
  const [username, setUsername] = useState<string>("");
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
      setDisabled(false);
    } else {
      setErrorMessage("This username is already taken!");
    }
  };

  // Accomodates live username change
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (username) {
        if (username.trim() !== "") {
          verifyUsername(username);
        }
      }
    }, 1000);

    // Clear the timer on each change
    return () => clearTimeout(timerId);
  }, [username]);

  // handles username field and disables button while typing
  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setDisabled(true);
  };

  const handleClaimUsername = async () => {
    // Store the username in local storage
    localStorage.setItem("claimedUsername", username);
  };

  return (
    <div className="text-primary-foreground lg:px-4">
      <h2 className="text-lg lg:text-2xl">Claim your username</h2>
      <div className="flex mt-2">
        <Button variant="secondary" className="text-lg rounded-l-full">
          jaayedaad.com/
        </Button>
        <Input
          value={username}
          placeholder="ShubhamPalriwala"
          className="rounded-l-none text-lg rounded-r-full w-1/3 md:w-1/4 bg-primary focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => handleUsernameChange(e.target.value)}
        />
        <Button
          variant="secondary"
          className="text-primary rounded-full ml-2 disabled:pointer-events-auto disabled:hover:cursor-not-allowed hover:bg-secondary"
          size="icon"
          disabled={disabled}
          onClick={() => {
            handleClaimUsername();
            signIn("google");
          }}
        >
          <MoveUpRight />
        </Button>
      </div>
      <div className="flex">
        <Button
          variant="secondary"
          className="invisible text-lg rounded-l-full"
        >
          jaayedaad.com/
        </Button>
        <p
          className={cn(
            "text-sm px-2",
            errorMessage.includes("available")
              ? "text-green-400"
              : "text-red-400"
          )}
        >
          {errorMessage}
        </p>
      </div>
    </div>
  );
}

export default ClaimUsername;
