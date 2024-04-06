import {
  AngelInvestmentsIcon,
  CryptoIcon,
  DataEncryptionIcon,
  FixedDepositsIcon,
  InviteOnlyIcon,
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
      className="relative pt-20 section flex flex-col justify-center text-center"
    >
      <Spotlight
        className="mt-[40rem] min-[376px]:max-xl:mt-[32rem] xl:mt-96"
        fill="#a78bfa"
      />
      <div className="flex w-full justify-center text-center">
        <div className="text-primary-foreground mb-8 lg:px-4 [mask-image:radial-gradient(ellipse_at_center,hsl(var(--background)),transparent_180%)]">
          <p className="font-mona-sans text-4xl">Features</p>
        </div>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-4 md:grid-rows-2 gap-4 md:px-0 xl:px-40 2xl:px-72 text-left">
        {/* categories */}
        <div className="flex flex-col justify-between col-span-2 row-span-2 border rounded-2xl px-2 pt-2 pb-20 md:pb-0 md:px-3 md:pt-3 lg:px-6 lg:pt-6">
          <p className="text-sm md:text-base px-1 pt-1">
            90+ countries, endless possibilities
          </p>
          <h3 className="md:text-2xl lg:text-3xl mt-2 mb-8 px-1">
            Any asset you imagine,
            <br />
            we&apos;ve got it covered!
          </h3>
          <div className="h-[35vh] min-[376px]:h-[26.5vh] md:h-1/2 md:max-lg:h-[55%] lg:h-2/3 border-x border-t rounded-t-xl p-1 lg:p-4 w-full bg-primary/5">
            <div className="relative">
              <div className="absolute -translate-y-6 md:-translate-y-4 md:max-lg:-translate-y-8 lg:-translate-y-10  grid grid-cols-2 gap-1 lg:gap-2">
                <div className="flex gap-2 lg:gap-4 items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 lg:p-4 border bg-primary/10 rounded-md shadow-2xl">
                    <StockIcon height={24} width={24} fill="#46B0FF" />
                  </div>
                  Stocks
                </div>
                <div className="flex gap-2 lg:gap-4 items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 border bg-primary/10 rounded-md shadow-2xl">
                    <CryptoIcon height={24} width={24} fill="#F2AE00" />
                  </div>
                  Crypto
                </div>
                <div className="flex gap-2 lg:gap-4 items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 lg:p-4 border bg-primary/10 rounded-md shadow-2xl">
                    <MutualFundIcon height={24} width={24} fill="#F91F87" />
                  </div>
                  Mutual Funds
                </div>
                <div className="flex gap-2 lg:gap-4 items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 lg:p-4 border bg-primary/10 rounded-md shadow-2xl">
                    <FixedDepositsIcon height={24} width={24} fill="#11FD53" />
                  </div>
                  Fixed Deposits
                </div>
                <div className="flex gap-2 lg:gap-4 items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 lg:p-4 border bg-primary/10 rounded-md shadow-2xl">
                    <AngelInvestmentsIcon
                      height={24}
                      width={24}
                      fill="#EBFF00"
                    />
                  </div>
                  Angel Investments
                </div>
                <div className="flex gap-2 lg:gap-4 items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 lg:p-4 border bg-primary/10 rounded-md shadow-2xl">
                    <PropertyIcon height={24} width={24} fill="#5920FB" />
                  </div>
                  Property
                </div>
                <div className="col-span-2 flex items-center py-2 pl-2 pr-4 border rounded-lg bg-[#171326] shadow-2xl">
                  <div className="p-2 lg:p-4 mr-2 lg:mr-4 border bg-primary/10 rounded-md shadow-2xl">
                    <OtherIcon height={24} width={24} fill="#C90CF9" />
                  </div>
                  Define your own categories, be it comic strips or Martian
                  rocks, because what&apos;s valuable to you, matters to us.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 row-span-1 bg-primary/5 border rounded-xl p-6 md:p-4 lg:p-6 flex items-start justify-between">
          <div>
            <p className="text-sm md:text-base mb-6">
              Encryption is a need, not a want!
            </p>
            <h3 className="text-base md:text-2xl">
              Your data, safely locked with <br />
              per-user AES encryption
            </h3>
          </div>
          <div className="my-auto lg:mx-auto">
            <DataEncryptionIcon height={72} width={72} fill="gray" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 col-span-2 row-span-1">
          <div className="col-span-1 flex flex-col justify-between border rounded-xl p-6 md:p-4 lg:p-6 bg-primary/5 drop-shadow-2xl">
            <div className="w-full inline-flex justify-between items-center">
              <p className="text-sm md:text-base mb-1 md:mb-0">
                Thanks to <br /> Sia Blockchain
              </p>
              <Image
                width="72"
                height="24"
                src="https://cryptologos.cc/logos/siacoin-sc-logo.png"
                alt="sia logo"
                className="h-[40px] w-[40px] md:h-12 md:w-16 lg:h-[72px] lg:w-[72px]"
              />
            </div>
            <div className="text-base md:text-xl">
              <h3 className="mt-1 lg:mt-4">Your data, your rules.</h3>
              <h3>Delete at will!</h3>
            </div>
          </div>
          {/* invite only */}
          <div className="text-left col-span-1 flex flex-col justify-between border rounded-xl p-6 md:p-4 lg:p-6 bg-primary/5 drop-shadow-2xl">
            <div className="flex justify-between items-center">
              <p>Invite Only!</p>
              <div className="lg:mr-6">
                <InviteOnlyIcon height={48} width={48} />
              </div>
            </div>
            <h3 className="text-base lg:text-xl">
              Claim your usernames & keep an eye on your email!
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;