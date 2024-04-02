import React from "react";

function Hero() {
  return (
    <div className="flex w-full justify-center text-center">
      <div className="text-primary-foreground lg:px-4 [mask-image:radial-gradient(ellipse_at_center,hsl(var(--background)),transparent_180%)]">
        <div className="font-mona-sans font-normal flex flex-col gap-2 md:gap-6">
          <div className="text-4xl lg:text-[52px]">
            Effortlessly and Securely
          </div>
          <div className="text-4xl lg:text-[58px]">
            Track All Your Investments
          </div>
        </div>
        <p className="pt-8 font-mona-sans lg:text-xl">
          From market stocks to vintage clocks, crypto coins to fine wines,
        </p>
        <p className="font-mona-sans lg:text-xl">
          track <b>every</b> asset while keeping your data confined!
        </p>
      </div>
    </div>
  );
}

export default Hero;
