"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { checkInviteCode, validateInviteCode } from "@/services/inviteCode";
import Link from "next/link";
import { Loader2, MoveLeftIcon } from "lucide-react";
import { MailIcon } from "@/public/whitelisting-modal/whitelistingModalIcons";
import XLogo from "@/public/branding/XLogo";

function WhitelistingModal({ whitelisted }: { whitelisted: boolean }) {
  const [inviteCodeValue, setInviteCodeValue] = useState("");
  const [title, setTitle] = useState("Enter your invite code to continue");
  const [subtitle, setSubtitle] = useState(
    "Get whitelisted for using a valid invite code."
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [codeValidated, setCodeValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyInviteCode = async (inviteCode: string) => {
    const validatedInviteCode = await checkInviteCode(inviteCode);
    if (validatedInviteCode) {
      setDisabled(false);
    } else {
      setTitle("Invalid invite code");
      setSubtitle("Please enter a valid invite code to continue");
      setErrorMessage("Invalid invite code, Try again!");
      setDisabled(true);
    }
  };
  // Check for changes in invite code value
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (inviteCodeValue) {
        if (inviteCodeValue.trim() !== "") {
          verifyInviteCode(inviteCodeValue);
        }
      } else {
        setErrorMessage("");
        setDisabled(true);
      }
    }, 1000);

    // Clear the timer on each change
    return () => clearTimeout(timerId);
  }, [inviteCodeValue]);

  const handleInviteCodeValueChange = async (value: string) => {
    setInviteCodeValue(value);
  };

  const handleVerifyInviteCode = async () => {
    setLoading(true);
    const inviteCodeObject = await checkInviteCode(inviteCodeValue);
    if (inviteCodeObject) {
      const userWhitelisted = await validateInviteCode(inviteCodeObject);
      if (userWhitelisted) {
        window.location.reload();
      }
    }
  };

  const handleContinueClick = () => {
    setCodeValidated(true);
    setErrorMessage(" ");
    setTitle("Congratulations!");
    setSubtitle("Your invite code has been validated");
  };

  return (
    <Dialog open={!whitelisted}>
      <DialogOverlay className="backdrop-blur-[6px] bg-transparent z-[49]" />
      <DialogContent className="max-w-[40rem] h-84" closeButton="hidden">
        <div>
          <Link href="/" className="flex items-center w-fit">
            <MoveLeftIcon className="mr-2" />
            Back to landing page
          </Link>
          <div className="mt-10 w-full">
            <div className="flex gap-8 ml-8">
              <MailIcon />
              <div>
                <p className="text-lg">{title}</p>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-2 px-4 w-full">
              {!codeValidated ? (
                <div className="w-full flex gap-4 justify-center">
                  <div>
                    <Input
                      value={inviteCodeValue}
                      className="w-full"
                      placeholder="Enter invite code"
                      onChange={(e) =>
                        handleInviteCodeValueChange(e.target.value)
                      }
                    />
                    <p className="text-red-500 text-xs mt-1 inline-flex justify-end">
                      {errorMessage.includes("Invalid") && errorMessage}
                    </p>
                  </div>
                  <Button onClick={handleContinueClick} disabled={disabled}>
                    Continue
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center w-full">
                  <Button
                    className="disabled:pointer-events-auto disabled:hover:cursor-not-allowed"
                    onClick={handleVerifyInviteCode}
                    disabled={disabled}
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Welcome to your Jaayedaad Dashboard
                  </Button>
                </div>
              )}
            </div>
            <p className="flex w-fit mx-auto mt-6 text-xs">
              Don&apos;t have an invite, DM us on <XLogo className="mr-0.5" />{" "}
              to get one.
            </p>
            <p className="w-fit mx-auto mt-1 text-muted-foreground text-xs">
              LIMITED INVITES ONLY
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WhitelistingModal;
