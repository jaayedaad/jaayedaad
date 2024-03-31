import { calculateCurrentValue } from "@/lib/assetCalculation";
import { TAsset } from "@/lib/types";

export const fetchQuoteFromApi = async (asset: TAsset): Promise<TAsset> => {
  if (asset.symbol !== null) {
    try {
      const response = await fetch(
        `https://api.twelvedata.com/quote?symbol=${asset.symbol}`,
        {
          method: "GET",
          headers: {
            Authorization: `apikey ${process.env.NEXT_PUBLIC_TWELVEDATA_API_KEY}`,
          },
        }
      );

      const quote = await response.json();

      if (!quote.code || quote.code !== 404) {
        asset.prevClose = (+quote.previous_close).toFixed(2);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  }

  const updatedAsset = calculateCurrentValue(asset);
  return updatedAsset;
};
