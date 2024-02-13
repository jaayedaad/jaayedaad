"use client";
import AssetTable from "@/components/assetTable";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useData } from "@/contexts/data-context";
import React, { useEffect, useState } from "react";

function AssetsPage() {
  const { assets } = useData();
  const [loadingAsset, setLoadingAsset] = useState(true);

  useEffect(() => {
    setLoadingAsset(false);
  }, [assets]);
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
            <>
              <div className="font-bold text-3xl">Assets by types:</div>
              {Array.from(new Set(assets.map((asset) => asset.type))).map(
                (assetType) => (
                  <>
                    <div key={assetType} className="my-8 text-xl font-bold">
                      {assetType} (
                      {
                        assets.filter((asset) => asset.type === assetType)
                          .length
                      }
                      )
                    </div>
                    <AssetTable
                      key={`table-${assetType}`}
                      data={assets.filter((asset) => asset.type === assetType)}
                    />
                  </>
                )
              )}
              <div className="font-bold text-3xl mt-10">
                Assets by exchange:
              </div>
              {Array.from(new Set(assets.map((asset) => asset.exchange))).map(
                (exchange) => (
                  <>
                    <div key={exchange} className="my-8 text-xl font-bold">
                      {exchange} (
                      {
                        assets.filter((asset) => asset.exchange === exchange)
                          .length
                      }
                      )
                    </div>
                    <AssetTable
                      key={`table-${exchange}`}
                      data={assets.filter(
                        (asset) => asset.exchange === exchange
                      )}
                    />
                  </>
                )
              )}
            </>
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
