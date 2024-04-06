import { redirect } from "next/navigation";
import { UsernameInputComponent } from "./components/usernameInput";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    redirect("/auth/signin");
  }
  if (session.user.username) {
    redirect("/dashboard");
  }
  return <UsernameInputComponent />;
}
