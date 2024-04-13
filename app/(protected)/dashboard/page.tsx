import { getDeccryptedAssetsByUserId, getAssetsQuoteFromApi } from "@/services/asset";
import Dashboard from "./newPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getConversionRate } from "@/services/thirdParty/currency";
import { getHistoricalData } from "@/services/thirdParty/twelveData";
import { getPreferenceFromUserId } from "@/services/preference";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    redirect("/");
  }

  const usernameSet = !session.user.username;
  const assets = await getAssetsQuoteFromApi(
    await getDeccryptedAssetsByUserId(session.user.id)
  );

  const currencyConversionRates = await getConversionRate(session.user.id);
  if (!currencyConversionRates) {
    throw new Error("Currency conversion rates not found");
  }
  const historicalData = await getHistoricalData(session.user.id, assets);

  const preferences = await getPreferenceFromUserId(session.user.id);
  if (!preferences) {
    throw new Error("Preference not found");
  }

  return (
    <Dashboard
      usernameSet={usernameSet}
      user={session.user}
      username={session.user.username}
      whitelisted={session.user.whitelisted}
      assets={assets}
      conversionRates={currencyConversionRates}
      historicalData={historicalData}
      preferences={preferences}
    />
  );
};

export default DashboardPage;
