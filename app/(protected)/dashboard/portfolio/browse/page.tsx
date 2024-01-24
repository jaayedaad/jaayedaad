"use client";
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
    async function fetchAssets() {
      try {
        const data = await fetch("/api/assets", {
          method: "GET",
        });
        const assets: Asset[] = await data.json();

        // Get symbols from the assets
        const assetSymbols = assets.map((asset) => asset.symbol);
        const assetSymbolsQuery = assetSymbols.join("%2C");

        // Get previous close values and their currency
        fetch(
          `https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=${assetSymbolsQuery}`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": process.env.NEXT_PUBLIC_YHFINANCE_KEY,
              "X-RapidAPI-Host": "yh-finance.p.rapidapi.com",
            },
          }
        )
          .then((response) => response.json())
          .then((responseData) => {
            const quotes = responseData.quoteResponse.result;
            // Update assets with relevant properties
            const updatedAssets = assets.map((asset) => {
              const matchingQuote = quotes.find(
                // @ts-ignore
                (quote) => quote.symbol === asset.symbol
              );

              if (matchingQuote) {
                asset.prevClose = matchingQuote.regularMarketPreviousClose;
              }

              return asset;
            });
            setAssets(updatedAssets);
            setLoadingAsset(false);
          });
      } finally {
        return;
      }
    }

    fetchAssets();
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
