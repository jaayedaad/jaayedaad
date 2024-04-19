import { Separator } from "@/components/ui/separator";
import React from "react";

function SettingsLoadingSkeleton() {
  return (
    <div className="animate-pulse mb-20 md:mb-24 lg:mb-0 py-6 px-6 w-full h-screen overflow-auto">
      <div>
        <div className="text-muted-foreground flex gap-1">
          <div className="flex flex-col w-full gap-2">
            <div className="text-3xl flex justify-between items-center text-foreground font-bold">
              <h2>Settings</h2>
              <div className="h-10 w-[87px] bg-slate-700"></div>
            </div>
            <div className="flex justify-between mt-4">
              <div>
                <h2 className="text-xl text-foreground font-bold">Profile</h2>
                <p className="text-sm text-muted-foreground">
                  Configure your your public visibilities
                </p>
              </div>
            </div>
            <Separator className="h-[2px]" />
            <div className="flex flex-col gap-4">
              <div className="py-5 px-4 flex items-center justify-between border rounded-lg w-full">
                <div className="flex flex-col gap-2">
                  <h2 className="h-4 w-28 rounded bg-slate-700 text-foreground"></h2>
                  <p className="h-3.5 w-60 rounded bg-slate-700 text-muted-foreground text-sm"></p>
                </div>
              </div>
              <div className="py-5 px-4 flex items-center justify-between border rounded-lg w-full">
                <div className="flex flex-col gap-2">
                  <h2 className="h-4 w-28 rounded bg-slate-700 text-foreground"></h2>
                  <p className="h-3.5 w-60 rounded bg-slate-700 text-muted-foreground text-sm"></p>
                </div>
              </div>
              <div className="py-5 px-4 flex items-center justify-between border rounded-lg w-full">
                <div className="flex flex-col gap-2">
                  <h2 className="h-4 w-28 rounded bg-slate-700 text-foreground"></h2>
                  <p className="h-3.5 w-60 rounded bg-slate-700 text-muted-foreground text-sm"></p>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div>
                <h2 className="text-xl text-foreground font-bold">
                  Preferences
                </h2>
                <p className="text-sm text-muted-foreground">
                  Configure your preferences
                </p>
              </div>
            </div>
            <Separator className="h-[2px]" />
            <div className="flex flex-col gap-4">
              <div className="py-5 px-4 flex items-center justify-between border rounded-lg w-full">
                <div className="flex flex-col gap-2">
                  <h2 className="h-4 w-28 rounded bg-slate-700 text-foreground"></h2>
                  <p className="h-3.5 w-60 rounded bg-slate-700 text-muted-foreground text-sm"></p>
                </div>
              </div>
              <div className="py-5 px-4 flex items-center justify-between border rounded-lg w-full">
                <div className="flex flex-col gap-2">
                  <h2 className="h-4 w-28 rounded bg-slate-700 text-foreground"></h2>
                  <p className="h-3.5 w-60 rounded bg-slate-700 text-muted-foreground text-sm"></p>
                </div>
              </div>
              <div className="py-5 px-4 flex items-center justify-between border rounded-lg w-full">
                <div className="flex flex-col gap-2">
                  <h2 className="h-4 w-28 rounded bg-slate-700 text-foreground"></h2>
                  <p className="h-3.5 w-60 rounded bg-slate-700 text-muted-foreground text-sm"></p>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div>
                <h2 className="text-xl text-foreground font-bold">Account</h2>
                <p className="text-sm text-muted-foreground">
                  Control what others can see about you
                </p>
              </div>
            </div>
            <Separator className="h-[2px]" />
            <div className="flex flex-col gap-4">
              <div className="py-5 px-4 flex items-center justify-between border rounded-lg w-full">
                <div className="flex flex-col gap-2">
                  <h2 className="h-4 w-28 rounded bg-slate-700 text-foreground"></h2>
                  <p className="h-3.5 w-60 rounded bg-slate-700 text-muted-foreground text-sm"></p>
                </div>
              </div>
              <div className="py-5 px-4 flex items-center justify-between border rounded-lg w-full">
                <div className="flex flex-col gap-2">
                  <h2 className="h-4 w-28 rounded bg-slate-700 text-foreground"></h2>
                  <p className="h-3.5 w-60 rounded bg-slate-700 text-muted-foreground text-sm"></p>
                </div>
              </div>
              <div className="py-5 px-4 flex items-center justify-between border rounded-lg w-full">
                <div className="flex flex-col gap-2">
                  <h2 className="h-4 w-28 rounded bg-slate-700 text-foreground"></h2>
                  <p className="h-3.5 w-60 rounded bg-slate-700 text-muted-foreground text-sm"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsLoadingSkeleton;
