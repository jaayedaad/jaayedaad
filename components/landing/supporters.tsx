import React from "react";
import { AnimatedTooltip } from "../ui/animate-tooltip";
import stock_icon from "@/public/feature-svgs/stock-icon.svg";
import crypto_icon from "@/public/feature-svgs/crypto-icon.svg";
import mutualfunds_icon from "@/public/feature-svgs/mutualfunds-icon.svg";
import property_icon from "@/public/feature-svgs/property-icon.svg";
import metals_icon from "@/public/feature-svgs/metals-icon.svg";
import wine_icon from "@/public/feature-svgs/wine-icon.svg";
import etf_icon from "@/public/feature-svgs/etf-icon.svg";
import fixeddeposit_icon from "@/public/feature-svgs/fixeddeposit-icon.svg";
import futureoption_icon from "@/public/feature-svgs/futureoptions-icon.svg";
import forex_icon from "@/public/feature-svgs/forex-icon.svg";
import artcollection_icon from "@/public/feature-svgs/artcollection-icon.svg";
import golf_icon from "@/public/feature-svgs/golf-icon.svg";
import bond_icon from "@/public/feature-svgs/bond-icon.svg";
import jewellery_icon from "@/public/feature-svgs/jewellery-icon.svg";

function Supporters() {
  const categories = [
    {
      id: 1,
      name: "Stocks",
      designation: "",
      image: stock_icon,
    },
    {
      id: 2,
      name: "Crypto",
      designation: "",
      image: crypto_icon,
    },
    {
      id: 3,
      name: "Mutual Funds",
      designation: "",
      image: mutualfunds_icon,
    },
    {
      id: 4,
      name: "Property",
      designation: "",
      image: property_icon,
    },
    {
      id: 5,
      name: "Metals",
      designation: "",
      image: metals_icon,
    },
    {
      id: 6,
      name: "Wines",
      designation: "",
      image: wine_icon,
    },
    {
      id: 7,
      name: "Fixed Deposits",
      designation: "",
      image: fixeddeposit_icon,
    },
    {
      id: 8,
      name: "Exchange Traded-Fund",
      designation: "",
      image: etf_icon,
    },
    {
      id: 9,
      name: "Forex",
      designation: "",
      image: forex_icon,
    },
    {
      id: 10,
      name: "Future Options",
      designation: "",
      image: futureoption_icon,
    },
    {
      id: 11,
      name: "Art",
      designation: "",
      image: artcollection_icon,
    },
    {
      id: 12,
      name: "Golf",
      designation: "",
      image: golf_icon,
    },
    {
      id: 13,
      name: "Jewellery",
      designation: "",
      image: jewellery_icon,
    },
    {
      id: 14,
      name: "Bonds",
      designation: "",
      image: bond_icon,
    },
  ];
  return (
    <div className="flex flex-col text-center lg:mt-44 mt-8">
      <div>
        <p className="text-lg text-muted-foreground">
          Our users surprise us everyday at Jaayedaad
        </p>
        <p className="text-lg">
          See the categories that are already being tracked on our platform
        </p>
      </div>
      <div className="flex flex-wrap justify-center mt-12 xl:px-44 gap-y-2">
        <AnimatedTooltip items={categories} />
      </div>
    </div>
  );
}

export default Supporters;
