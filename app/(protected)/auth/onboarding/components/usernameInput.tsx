"use client";

import { updateUsernameAction, verifyUsernameAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
      console.log(username);

      await updateUsernameAction(username);
      router.push("/dashboard");
    } else {
      setSubmitting(false);
    }
  }, [username, router]);

  useEffect(() => {
    const claimedUsername = localStorage.getItem("claimedUsername");
    if (claimedUsername) {
      setUsername(claimedUsername);
      handleSubmit();
      localStorage.removeItem("claimedUsername");
    }
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
      <div className="pt-4 flex flex-col">
        <Button
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
