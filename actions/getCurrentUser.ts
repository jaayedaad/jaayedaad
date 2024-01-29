"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

    const res = await fetch("http://localhost:3000/api/getcurrentuser", {
      method: "GET",
      headers: {
        Cookie: cookiesString,
      },
      credentials: "include",
    });

    return res.json();
  }
}
