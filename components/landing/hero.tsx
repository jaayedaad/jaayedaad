import React from "react";

function Hero() {
  return (
    <div className="flex w-full justify-center text-center">
      <div className="text-primary-foreground lg:px-4 [mask-image:radial-gradient(ellipse_at_center,hsl(var(--background)),transparent_180%)]">
        <div className="font-mona-sans font-normal flex flex-col gap-2 md:gap-6">
          <div className="text-4xl lg:text-[52px]">Track your investments</div>
          <div className="text-4xl lg:text-[58px]">smartly with jaayedaad</div>
        </div>
        <p className="pt-8 font-mona-sans lg:text-xl">
          Track your investments all at one place with detailed analysis of your
          outstanding
        </p>
      </div>
    </div>
  );
}

export default Hero;
