import { getAssetsByUser, getAssetsQuoteFromApi } from "@/services/asset";
import Dashboard from "./newPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getUser } from "@/services/user";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }
  const user = await getUser(session);
  if (!user.username) {
    redirect("/auth/onboarding");
  }
  let assets = await getAssetsByUser(user.email);
  const quotedAssets = await getAssetsQuoteFromApi(assets);

  return <Dashboard assets={quotedAssets} />;
};

export default DashboardPage;
