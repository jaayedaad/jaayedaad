"use client";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Onboarding() {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  // Check for availability of username
  const verifyUsername = async (username: string) => {
    const regex = /^[a-zA-Z0-9_]+$/; // regular expression for alphanumeric characters & underscores
    if (!regex.test(username)) {
      setErrorMessage(
        "Username can only contain alphanumeric characters or underscores!"
      );
      return;
    } else if (username.length < 3) {
      setErrorMessage("Username must be at least 3 characters!");
      return;
    }
    const data = await fetch("/api/onboarding", {
      method: "POST",
      body: JSON.stringify({ username: username.toLowerCase() }),
    });
    const user: object[] = await data.json();
    if (user.length === 0) {
      setErrorMessage("Username available");
      setButtonDisabled(false);
    } else {
      setErrorMessage("This username is already taken!");
    }
  };

  // handles submitting of username
  const handleSubmit = async (username: string) => {
    setSubmitting(true);
    await fetch(`/api/onboarding?username=${username}`, {
      method: "GET",
    });

    router.push("/dashboard");
  };

  // handles username field and disables button while typing
  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setButtonDisabled(true);
  };

  // Fetches current user & redirects to dashboard if username is set
  useEffect(() => {
    const claimedUsername = localStorage.getItem("claimedUsername");
    if (claimedUsername) {
      setUsername(claimedUsername);
      // Remove claimedUsername from local storage
      localStorage.removeItem("claimedUsername");
      handleSubmit(claimedUsername);
    }
    getCurrentUser().then((userResponse) => {
      if (userResponse?.userData.username) {
        router.push("/dashboard");
      }
    });
  }, []);

  // Accomodates live username change
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (username) {
        verifyUsername(username);
      } else {
        setErrorMessage("Username cannot be empty!");
      }
    }, 1000);

    // Clear the timer on each change
    return () => clearTimeout(timerId);
  }, [username]);

  return (
    <div className="w-96">
      <Label htmlFor="username">Username</Label>
      <Input
        type="text"
        id="username"
        placeholder="username..."
        value={username}
        onChange={(e) => handleUsernameChange(e.target.value)}
      />
      <p
        className={`text-xs pt-1 ${
          errorMessage.includes("available") ? "text-green-500" : "text-red-500"
        }`}
      >
        {errorMessage}
      </p>
      <div className="pt-4 flex flex-col">
        <Button
          onClick={() => handleSubmit(username)}
          disabled={buttonDisabled}
        >
          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Submit
        </Button>
      </div>
    </div>
  );
}

export default Onboarding;
