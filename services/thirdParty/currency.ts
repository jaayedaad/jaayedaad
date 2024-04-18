import { TConversionRates } from "@/types/types";
import { getPreferenceFromUserId } from "../preference";

export const getConversionRate = async (
  userId: string
): Promise<TConversionRates | null> => {
  let retryCount = 0;
  const maxRetries = 5; // Maximum number of retries
  while (retryCount < maxRetries) {
    try {
      const preference = await getPreferenceFromUserId(userId);
      if (!preference) {
        return null;
      }
      const userPreferredCurrency: string =
        preference.defaultCurrency.toLowerCase() || "usd";
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${userPreferredCurrency}.json`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const {
        [userPreferredCurrency]: conversions,
      }: { [key: string]: { [currency: string]: number } } =
        await response.json();
      return conversions;
    } catch (err) {
      console.error(
        `Attempt ${
          retryCount + 1
        }: Error in getConversionRate for user ${userId} - ${err}`
      );
      retryCount++;
      if (retryCount === maxRetries) {
        console.error(
          "Maximum retries reached. Unable to fetch conversion rate."
        );
        return null;
      }
    }
  }
  return null;
};
