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
    <div className="flex flex-col text-center mt-24">
      <div>
        <p className="text-lg text-muted-foreground">
          Powering the world&apos;s best product teams.
        </p>
        <p className="text-lg">
          From next-gen startups to established enterprises.
        </p>
      </div>
      <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:flex justify-center mt-12 gap-6 lg:gap-10">
        <AnimatedTooltip items={categories} />
      </div>
    </div>
  );
}

export default Supporters;
