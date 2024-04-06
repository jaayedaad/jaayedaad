import { TConversionRates } from "@/lib/types";
import { getPreferenceFromUserId } from "../preference";

export const getConversionRate = async (
  userId: string
): Promise<TConversionRates | null> => {
  const preference = await getPreferenceFromUserId(userId);
  if (!preference) {
    return null;
  }
  const userPreferredCurrency: string =
    preference.defaultCurrency.toLowerCase() || "usd";
  const response = await fetch(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${userPreferredCurrency}.json`
  );
  const {
    [userPreferredCurrency]: conversions,
  }: { [key: string]: { [currency: string]: number } } = await response.json();
  return conversions;
};
