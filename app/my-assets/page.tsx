"use client";
import AssetTable from "@/components/assetTable";
import { Asset } from "@prisma/client";
import React, { useEffect, useState } from "react";

function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>();
  useEffect(() => {
    async function fetchAssets() {
      const data = await fetch("/api/assets", {
        method: "GET",
      });
      const assets = await data.json();
      setAssets(assets);
    }

    fetchAssets();
  }, []);
  return (
    <div className="flex min-h-screen flex-col py-2 px-12">
      <div className="py-10">
        <h1 className="text-5xl font-bold">My Assets</h1>
        <p className="text-muted-foreground pt-1">Manage all of your assets</p>
      </div>
      <div>{assets && <AssetTable assets={assets} />}</div>
    </div>
  );
}

export default AssetsPage;
