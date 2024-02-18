"use server";
import { authOptions } from "@/utils/authOptions";
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

    return res.json();
  }
}
