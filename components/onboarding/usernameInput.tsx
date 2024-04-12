"use client";

import { updateUsernameAction, verifyUsernameAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useCallback, useEffect, useState } from "react";

export const UsernameInputComponent = () => {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validating, setValidating] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    const isUsernameValid = await verifyUsernameAction(username);
    if (isUsernameValid) {
      await updateUsernameAction(username);
      posthog.capture("username_claimed", { username });
      router.refresh();
    } else {
      setSubmitting(false);
    }
  }, [username, router]);

  useEffect(() => {
    async function getClaimedUsername() {
      const claimedUsername = localStorage.getItem("claimedUsername");
      if (claimedUsername) {
        setUsername(claimedUsername);
        await handleSubmit();
        localStorage.removeItem("claimedUsername");
      }
    }

    getClaimedUsername();
  }, [handleSubmit]);

  useEffect(() => {
    const validateUsername = async () => {
      if (username) {
        setValidating(true);
        const message = await verifyUsernameAction(username);
        setErrorMessage(message);
        setValidating(false);
      } else {
        setErrorMessage("");
      }
    };

    validateUsername();
  }, [username]);

  return (
    <div className="w-96">
      <Label htmlFor="username">Username</Label>
      <Input
        className="mt-2"
        type="text"
        id="username"
        placeholder="username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <p
        className={`text-xs pt-1 ${
          errorMessage.includes("available") ? "text-green-500" : "text-red-500"
        }`}
      >
        {validating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          errorMessage
        )}
      </p>
      <div className="pt-4 flex flex-col mb-6">
        <Button
          className="disabled:bg-[#292929] disabled:pointer-events-auto disabled:hover:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={submitting || username.length === 0}
        >
          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Submit
        </Button>
      </div>
    </div>
  );
};
