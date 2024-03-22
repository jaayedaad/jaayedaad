"use server";
import { authOptions } from "@/utils/authOptions";
import { Asset } from "@prisma/client";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (session) {
    const cookieStores = cookies();
    const cookiesArray = cookieStores.getAll();
    const cookiesString = cookiesArray
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join(";");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/getcurrentuser`,
      {
        method: "GET",
        headers: {
          Cookie: cookiesString,
        },
        credentials: "include",
      }
    );

    const userResponse: {
      usersManualCategories: {
        id: string;
        icon: keyof typeof dynamicIconImports;
        name: string;
        userId: string;
        assets: Asset[];
      }[];
      userData: {
        id: string;
        name: string | null;
        username: string | null;
        email: string;
        emailVerified: Date | null;
        image: string | null;
      };
    } = await res.json();

    return userResponse;
  }
}
