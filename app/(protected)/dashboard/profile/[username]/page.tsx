import { User } from "@prisma/client";
import { getCurrentUser } from "@/actions/getCurrentUser";
import Image from "next/image";
import { IndianRupee, Settings } from "lucide-react";
import { Asset, getAssets } from "@/actions/getAssetsAction";
import { getConversionRate } from "@/actions/getConversionRateAction";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function calculateProfit(assets: Asset[], conversionRate: String) {
  const amounts = assets
    .map((asset) => {
      const { buyCurrency, quantity, buyPrice, prevClose } = asset;
      const conversionFactor = buyCurrency === "USD" ? +conversionRate : 1;

      const buyAmount = +quantity * +buyPrice * conversionFactor;
      const currentAmount = +quantity * +prevClose * conversionFactor;

      return { buyAmount, currentAmount };
    })
    .reduce(
      (accumulator, current) => {
        accumulator.buyAmount += current.buyAmount;
        accumulator.currentAmount += current.currentAmount;
        return accumulator;
      },
      { buyAmount: 0, currentAmount: 0 }
    );

  return amounts;
}

async function Profile({ params }: { params: { username: string } }) {
  const user: User = await getCurrentUser();
  const assets = await getAssets();
  const conversionRate = await getConversionRate();
  const holdings = calculateProfit(assets, conversionRate);
  const profitLoss = holdings.currentAmount - holdings.buyAmount;
  const textColorClass = profitLoss >= 0 ? "text-green-400" : "text-red-400";

  return (
    <div className="mt-14 py-6 px-48 flex">
      <div className="min-w-[160px] mr-12">
        <div className="fixed">
          <Image
            src={user.image!}
            alt="profile picture"
            width={160}
            height={160}
            className="rounded-md mb-2 border-2 border-spacing-2"
            priority
          />
          <h2 className="text-lg text-center">{params?.username}</h2>
          <div className="flex flex-col mt-8">
            <Button variant="ghost" className="justify-start" asChild>
              <Link href={`/dashboard/profile/${params.username}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <h1 className="text-5xl font-bold">Portfolio</h1>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-4 rounded-md border w-full">
            <p className="text-sm flex items-center justify-between mb-2">
              Holdings <IndianRupee className="h-3 w-3" />
            </p>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-6 w-6" strokeWidth={3} />
              <span className="text-2xl font-bold">
                {holdings.currentAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              Income: <IndianRupee className={cn("h-4 w-4", textColorClass)} />
              <span className={textColorClass}>
                {profitLoss.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
