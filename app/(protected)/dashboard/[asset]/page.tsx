"use client";
import AssetPieChart from "@/components/assetPieChart";
import AssetTable from "@/components/assetTable";
import PortfolioLineChart from "@/components/portfolioLineChart";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useData } from "@/contexts/data-context";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

function Page({ params }: { params: { asset: string } }) {
  const { assets, historicalData } = useData();

  // Get today's date
  const today = new Date();

  // Subtract one day
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return (
    <div className="px-6 py-6 w-full h-screen flex flex-col">
      <div className="h-[6vh]">
        <Button className="justify-start w-fit" asChild>
          <Link href="/dashboard/portfolio/add">
            <Plus className="mr-2" size={20} /> Add {params.asset}
          </Link>
        </Button>
      </div>
      <div className="min-h-[85vh] h-full mt-4">
        <div className="grid grid-rows-7 grid-cols-3 gap-4 h-full">
          <div className="row-span-3 col-span-1 border rounded-xl p-4">
            <AssetPieChart view={params.asset} />
          </div>
          <div className="row-span-3 col-span-2 border rounded-xl p-4">
            {historicalData ? (
              <PortfolioLineChart data={historicalData} view={params.asset} />
            ) : (
              <div>
                <h3 className="font-semibold">Portfolio Performance</h3>
                <p className="text-muted-foreground text-sm">
                  Insight into your portfolio&apos;s value dynamics
                </p>
                <LoadingSpinner />
              </div>
            )}
          </div>
          <div className="row-span-4 flex flex-col col-span-3 border rounded-xl p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">Asset Overview</h3>
                <p className="text-muted-foreground text-sm">
                  Comprehensive list of your owned {params.asset}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  Last update on ({yesterday.toLocaleDateString()})
                </p>
              </div>
            </div>
            <div className="mt-6">
              {assets ? (
                <AssetTable data={assets} view={params.asset} />
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
