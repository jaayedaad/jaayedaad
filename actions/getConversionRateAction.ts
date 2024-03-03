import { getPreferences } from "./getPreferencesAction";

export async function getConversionRate() {
  const userPreferences = await getPreferences();
  const userPreferredCurrency: string =
    userPreferences.defaultCurrency.toLowerCase();
  const response = await fetch(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${userPreferredCurrency}.json`
  );
  const {
    [userPreferredCurrency]: conversions,
  }: { [key: string]: { [currency: string]: number } } = await response.json();

  return conversions;
}
