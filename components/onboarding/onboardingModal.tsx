import React from "react";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";
import { UsernameInputComponent } from "./usernameInput";

function OnboardingModal({ usernameSet }: { usernameSet: boolean }) {
  return (
    <Dialog open={usernameSet}>
      <DialogOverlay className="backdrop-blur-[6px] bg-transparent z-[49]" />
      <DialogContent className="max-w-[40rem]" closeButton="hidden">
        <div className="py-6 text-center">
          <h1 className="text-3xl font-bold">Claim your username</h1>
          <p className="text-sm text-muted-foreground pt-1">
            This is what we&apos;ll be using as your display name.
            <br /> You can change it later if it&apos;s available.
          </p>
        </div>
        <div className="flex justify-center">
          <UsernameInputComponent />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingModal;
