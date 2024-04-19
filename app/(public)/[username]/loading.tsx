import React from "react";

function ProfileLoadingSkeleton() {
  return (
    <div className="h-screen">
      <div className="h-full">
        <div className="grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-7 h-full gap-6 p-6">
          <div className="h-[225px] lg:h-auto flex flex-col lg:col-span-2 lg:row-span-3 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-6">
            <h3 className="h-4 w-28 bg-slate-700 rounded font-semibold"></h3>
            <p className="h-3.5 w-64 bg-slate-700 mt-1 rounded text-muted-foreground text-xs xl:text-sm"></p>
            <div className="h-3/4 mt-2 rounded bg-slate-700"></div>
          </div>
          <div className="h-[225px] lg:h-auto flex flex-col lg:col-span-4 lg:row-span-3 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-6">
            <h3 className="h-4 w-28 bg-slate-700 rounded font-semibold"></h3>
            <p className="h-3.5 w-64 bg-slate-700 mt-1 rounded text-muted-foreground text-xs xl:text-sm"></p>
            <div className="h-3/4 mt-2 rounded bg-slate-700"></div>
          </div>
          <div className="h-[225px] lg:h-auto flex flex-col lg:col-span-4 lg:row-span-4 bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-6">
            <h3 className="h-4 w-28 bg-slate-700 rounded font-semibold"></h3>
            <p className="h-3.5 w-64 bg-slate-700 mt-1 rounded text-muted-foreground text-xs xl:text-sm"></p>
            <div className="h-3/4 mt-2 rounded bg-slate-700"></div>
          </div>
          <div className="h-[225px] lg:h-auto lg:col-span-2 lg:row-span-4 flex flex-col justify-between bg-[#171326]/70 backdrop-blur shadow-2xl border rounded-xl p-6">
            <h3 className="h-4 w-28 bg-slate-700 rounded font-semibold"></h3>
            <p className="h-3.5 w-64 bg-slate-700 mt-1 rounded text-muted-foreground text-xs xl:text-sm"></p>
            <div className="h-3/4 mt-2 rounded bg-slate-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileLoadingSkeleton;
