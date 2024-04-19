import JaayedaadLogo from "@/public/branding/jaayedaadLogo";
import React from "react";

function DashboardLoadingSkeleton() {
  return (
    <div className="animate-pulse px-6 sm:px-8 pt-6 pb-20 md:pb-24 lg:py-4 w-full lg:h-screen xl:h-screen flex flex-col">
      <div className="inline-flex lg:grid lg:grid-cols-2 justify-between items-center lg:gap-6">
        <div className="col-span-1 hidden lg:block">
          <div className="flex gap-2">
            <div className="rounded-full size-[52px] bg-slate-700" />
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground rounded-full h-4 w-32 bg-slate-700"></p>
              <h3 className="text-2xl font-samarkan rounded-full h-6 w-24 bg-slate-700"></h3>
            </div>
          </div>
        </div>
        <div className="flex justify-between lg:justify-end items-center w-full lg:w-auto">
          <JaayedaadLogo className="h-8 lg:hidden" />
          <div className="ml-2 w-fit">
            <div className="flex gap-1 justify-center items-center">
              <div className="size-10 rounded-md bg-slate-700"></div>
              <div className="size-10 rounded-md bg-slate-700"></div>
              <div className="size-10 rounded-md bg-slate-700"></div>
              <div className="size-10 rounded-md bg-slate-700"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-[85vh] h-full mt-4">
        <div className="gap-4 sm:gap-6 md:gap-6 lg:gap-4 grid grid-cols-1 lg:grid-rows-7 lg:grid-cols-3 lg:h-full text-foreground">
          <div className="h-[225px] lg:h-auto flex flex-col lg:col-span-1 lg:row-span-3 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-4">
            <h3 className="h-4 w-28 bg-slate-700 rounded font-semibold"></h3>
            <p className="h-3.5 w-64 bg-slate-700 mt-1 rounded text-muted-foreground text-xs xl:text-sm"></p>
            <div className="h-3/4 mt-2 rounded bg-slate-700"></div>
          </div>
          <div className="h-[225px] lg:h-auto flex flex-col lg:col-span-2 lg:row-span-3 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-4">
            <h3 className="h-4 w-28 bg-slate-700 rounded font-semibold"></h3>
            <p className="h-3.5 w-64 bg-slate-700 mt-1 rounded text-muted-foreground text-xs xl:text-sm"></p>
            <div className="h-3/4 mt-2 rounded bg-slate-700"></div>
          </div>
          <div className="h-[225px] lg:h-auto flex flex-col lg:col-span-2 lg:row-span-4 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-4">
            <h3 className="h-4 w-28 bg-slate-700 rounded font-semibold"></h3>
            <p className="h-3.5 w-64 bg-slate-700 mt-1 rounded text-muted-foreground text-xs xl:text-sm"></p>
            <div className="h-3/4 mt-2 rounded bg-slate-700"></div>
          </div>
          <div className="h-[225px] lg:h-auto flex flex-col lg:col-span-1 lg:row-span-4 justify-between bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-4 mb-4 md:mb-6 lg:mb-0">
            <h3 className="h-4 w-28 bg-slate-700 rounded font-semibold"></h3>
            <p className="h-3.5 w-64 bg-slate-700 mt-1 rounded text-muted-foreground text-xs xl:text-sm"></p>
            <div className="h-3/4 mt-2 rounded bg-slate-700"></div>
          </div>
          <div className="hidden px-1 h-6 w-full col-span-3 lg:block bg-slate-700"></div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLoadingSkeleton;
