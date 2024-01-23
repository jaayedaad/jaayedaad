"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Onboarding() {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonState, setButtonState] = useState(true);

  const router = useRouter();

  // Check for availability of username
  const verifyUsername = async (username: string) => {
    const regex = /^[a-zA-Z0-9_]+$/; // regular expression for alphanumeric characters & underscores
    if (!regex.test(username)) {
      setErrorMessage(
        "Username can only contain alphanumeric characters or underscores!"
      );
      return;
    } else {
      if (username.length < 3) {
        setErrorMessage("Username must be at least 3 characters!");
        return;
      }
    }
    const data = await fetch("/api/onboarding", {
      method: "POST",
      body: JSON.stringify({ username: username.toLowerCase() }),
    });
    const user: object[] = await data.json();
    if (user.length === 0) {
      setErrorMessage("Username available");
      setButtonState(false);
    } else {
      setErrorMessage("This username is already taken!");
    }
  };

  // handles submitting of username
  const handleSubmit = async () => {
    await fetch(`/api/onboarding?username=${username}`, {
      method: "GET",
    });

    router.push("/");
  };

  // handles username field and disables button while typing
  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setButtonState(true);
  };

  // fetches current user & accomodates live username change
  useEffect(() => {
    // fetch current user
    fetch("/api/getcurrentuser", { method: "GET" })
      .then(async (response) => {
        const user = await response.json();
        if (username !== user.id) {
          router.push("/");
        }
      })
      .catch((err) => console.log(err));

    const timerId = setTimeout(() => {
      if (username) {
        verifyUsername(username);
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
        <Button onClick={handleSubmit} disabled={buttonState}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default Onboarding;
