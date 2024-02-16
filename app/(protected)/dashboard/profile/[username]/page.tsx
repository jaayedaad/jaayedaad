import { User } from "@prisma/client";
import { getCurrentUser } from "@/actions/getCurrentUser";
import Image from "next/image";
import { IndianRupee, Settings } from "lucide-react";
import { getAssets } from "@/actions/getAssetsAction";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { totalAmountCalculator } from "@/helper/totalAmountCalculator";

async function Profile({ params }: { params: { username: string } }) {
  const user: User = await getCurrentUser();
  const assets = await getAssets();

  let holdings, profitLoss, textColorClass;
  if (assets) {
    holdings = totalAmountCalculator(assets);
    profitLoss = holdings.currentAmount - holdings.buyAmount;
    textColorClass = profitLoss >= 0 ? "text-green-400" : "text-red-400";
  }

  return (
    <div className="my-6 px-6 w-full flex">
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
        {assets ? (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <div className="p-4 rounded-md border w-full">
                <p className="text-sm flex items-center justify-between mb-2">
                  Holdings <IndianRupee className="h-3 w-3" />
                </p>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-6 w-6" strokeWidth={3} />
                  <span className="text-2xl font-bold">
                    {holdings?.currentAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  Income:{" "}
                  <IndianRupee className={cn("h-4 w-4", textColorClass)} />
                  <span className={textColorClass}>
                    {profitLoss?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>You haven&apos;t added any assets yet!</div>
        )}
      </div>
    </div>
  );
}

export default Profile;
