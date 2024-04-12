"use client";

import { updateUsernameAction, verifyUsernameAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useCallback, useEffect, useState } from "react";

import React from "react";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";

function OnboardingModal({ usernameSet }: { usernameSet: boolean }) {
  const router = useRouter();
  const [input, setInput] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [usernameFromLocalStorage, setUsernameFromLocalStorage] = useState("");

  useEffect(() => {
    const usernameFromLocalStorage = localStorage.getItem("claimedUsername");
    if (usernameFromLocalStorage) {
      setUsernameFromLocalStorage(usernameFromLocalStorage);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    const isUsernameValid = await verifyUsernameAction(input);
    if (isUsernameValid) {
      await updateUsernameAction(input);
      posthog.capture("username_claimed", { username: input });
      router.refresh();
    } else {
      setSubmitting(false);
    }
  }, [input, router]);

  useEffect(() => {
    async function getClaimedUsername() {
      if (localStorage.getItem("claimedUsername")) {
        setInput(localStorage.getItem("claimedUsername") || "");
        await handleSubmit();
        localStorage.removeItem("claimedUsername");
      }
    }

    getClaimedUsername();
  }, [handleSubmit]);

  useEffect(() => {
    const validateUsername = async () => {
      if (input) {
        setValidating(true);
        const message = await verifyUsernameAction(input);
        setErrorMessage(message);
        setValidating(false);
      } else {
        setErrorMessage("");
      }
    };

    validateUsername();
  }, [input]);

  if (usernameFromLocalStorage) return null;

  return (
    <>
      <Dialog open={usernameSet}>
        <DialogOverlay className="backdrop-blur-[6px] bg-transparent z-[49]" />
        <DialogContent className="max-w-[40rem]" closeButton="hidden">
          <div className="py-6 text-center">
            <h1 className="text-3xl font-bold">Claim your username</h1>
            <p className="text-sm text-muted-foreground pt-1">
              This is what we&apos;ll be using as your display name.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-96">
              <Input
                type="text"
                id="username"
                placeholder="Don't worry, it can be changed later!"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <p
                className={`text-xs pt-1 ${
                  errorMessage.includes("available")
                    ? "text-green-500"
                    : "text-red-500"
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
                  disabled={submitting || input.length < 3}
                >
                  {submitting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default OnboardingModal;
