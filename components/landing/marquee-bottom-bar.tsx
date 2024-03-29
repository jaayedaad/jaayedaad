import React from "react";
import { defaultCategories } from "@/constants/category";
import Marquee from "react-fast-marquee";

const categoryMapping: Record<string, string> = {
  "common stock": "Stocks",
  "digital currency": "Crypto Currency",
  "mutual fund": "Mutual Funds",
};

function MarqueeBottomBar() {
  const categoryElements = defaultCategories.map((category) => (
    <div
      key={category}
      className="h-10 mx-2 px-4 py-2 text-primary-foreground border rounded-full"
    >
      {categoryMapping[category]}
    </div>
  ));

  return (
    <div className="fixed bottom-12">
      <Marquee>
        {categoryElements}
        {categoryElements}
        {categoryElements}
        {categoryElements}
        {categoryElements}
        {categoryElements}
      </Marquee>
    </div>
  );
}

export default MarqueeBottomBar;
