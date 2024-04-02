import {
  CryptoIcon,
  DataEncryptionIcon,
  FixedDepositsIcon,
  FreeOfCostIcon,
  MetalsIcon,
  MutualFundIcon,
  OtherIcon,
  PropertyIcon,
  StockIcon,
} from "@/public/feature-svgs/featureIcons";
import React from "react";
import { Spotlight } from "../ui/spotlight";
import Image from "next/image";

function Features() {
  return (
    <div
      id="features"
      className="section flex flex-col justify-center text-center"
    >
      <Spotlight
        className="mt-48 min-[376px]:max-md:mt-[32rem] md:mt-[64rem] lg:mt-[84rem] xl:mt-[30rem]"
        fill="#a78bfa"
      />
      <div className="flex w-full justify-center text-center">
        <div className="text-primary-foreground mb-6 lg:px-4 [mask-image:radial-gradient(ellipse_at_center,hsl(var(--background)),transparent_180%)]">
          <div className="font-mona-sans font-normal flex flex-col gap-6"></div>
          <p className="font-mona-sans text-4xl">Features</p>
        </div>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-4 md:grid-rows-2 gap-4 md:px-0 xl:px-40 text-left">
        <div className="flex flex-col justify-between col-span-2 row-span-2 border rounded-2xl px-2 pt-2 md:px-3 md:pt-3 lg:px-6 lg:pt-6">
          <p className="text-sm md:text-base px-1 pt-1">Host from pipeline</p>
          <h3 className="text-2xl lg:text-3xl mt-2 mb-8 px-1">
            Once built, launch it!
            <br />
            Host static sites straight from workflows
          </h3>
          <div className="h-[35vh] min-[376px]:h-[26.5vh] md:h-1/2 md:max-lg:h-3/5 lg:h-2/3 border-x border-t rounded-t-xl p-1 lg:p-4 w-full bg-primary/5">
            <div className="relative">
              <div className="absolute -translate-y-6 md:-translate-y-4 md:max-lg:-translate-y-8 lg:-translate-y-10  grid grid-cols-2 gap-1 lg:gap-4">
                <div className="flex gap-2 lg:gap-4 items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 lg:p-4 border bg-primary/10 rounded-md shadow-2xl">
                    <StockIcon height={24} width={24} />
                  </div>
                  Stocks
                </div>
                <div className="flex gap-2 lg:gap-4 items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 border bg-primary/10 rounded-md shadow-2xl">
                    <CryptoIcon height={24} width={24} />
                  </div>
                  Crypto
                </div>
                <div className="flex gap-2 lg:gap-4 items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 lg:p-4 border bg-primary/10 rounded-md shadow-2xl">
                    <MutualFundIcon height={24} width={24} />
                  </div>
                  Mutual Funds
                </div>
                <div className="flex gap-2 lg:gap-4 items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 lg:p-4 border bg-primary/10 rounded-md shadow-2xl">
                    <FixedDepositsIcon height={24} width={24} />
                  </div>
                  Fixed Deposits
                </div>
                <div className="flex gap-2 lg:gap-4 items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 lg:p-4 border bg-primary/10 rounded-md shadow-2xl">
                    <MetalsIcon height={24} width={24} />
                  </div>
                  Angel Investments
                </div>
                <div className="flex gap-2 lg:gap-4 items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 lg:p-4 border bg-primary/10 rounded-md shadow-2xl">
                    <PropertyIcon height={24} width={24} />
                  </div>
                  Property
                </div>
                <div className="col-span-2 flex items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 lg:p-4 mr-2 lg:mr-4 border bg-primary/10 rounded-md shadow-2xl">
                    <OtherIcon height={24} width={24} />
                  </div>
                  Others
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 row-span-1 bg-primary/5 border rounded-xl p-6 md:p-4 lg:p-6 flex items-start justify-between">
          <div>
            <p className="text-sm md:text-base mb-6">Change-based runs</p>
            <h3 className="text-2xl lg:text-3xl">
              Turbo fast change aware builds & deployment
            </h3>
          </div>
          <div className="my-auto">
            <DataEncryptionIcon height={128} width={128} fill="gray" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 col-span-2 row-span-1">
          <div className="col-span-1 border rounded-xl p-6 md:p-4 lg:p-6 bg-primary/5 drop-shadow-2xl">
            <div className="w-full inline-flex justify-end">
              <div className="h-12 w-16 md:h-12 md:w-16 lg:h-[88px] lg:w-[88px]">
                <Image
                  width="88"
                  height="24"
                  src="https://cryptologos.cc/logos/siacoin-sc-logo.png"
                  alt="sia logo"
                />
              </div>
            </div>
            <p className="mb-1 lg:mb-4">subtitle</p>
            <h3 className="text-xl">Blockchain Integration</h3>
          </div>
          <div className="text-left col-span-1 border rounded-xl p-6 md:p-4 lg:p-6 flex flex-col bg-primary/5 drop-shadow-2xl">
            <p className="mb-6 lg:mb-12">Invite Only!</p>
            <h3 className="md:text-lg lg:text-xl">
              Sign Up to send your Invitations Now!
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
