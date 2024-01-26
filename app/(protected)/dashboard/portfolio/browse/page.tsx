"use client";
import { getAssets } from "@/actions/getAssetsAction";
import AssetTable from "@/components/assetTable";
import LoadingSpinner from "@/components/ui/loading-spinner";
import React, { useEffect, useState } from "react";

type Asset = {
  id: string;
  name: string;
  symbol: string;
  quantity: string;
  buyPrice: string;
  buyCurrency: string;
  prevClose: string;
  buyDate: Date;
  userId: string;
};

function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>();
  const [loadingAsset, setLoadingAsset] = useState(true);

  useEffect(() => {
    getAssets().then((assets) => {
      setAssets(assets);
      setLoadingAsset(false);
    });
  }, []);
  return (
    <div className="flex min-h-screen w-full flex-col py-10 px-12">
      <div className="py-10">
        <h1 className="text-5xl font-bold">My Assets</h1>
        <p className="text-muted-foreground pt-1">Manage all of your assets</p>
      </div>
      {loadingAsset ? (
        <LoadingSpinner />
      ) : (
        <div>
          {assets ? (
            <AssetTable assets={assets} />
          ) : (
            <div className="text-center mt-24">
              You haven&apos;t added any assets yet!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AssetsPage;
