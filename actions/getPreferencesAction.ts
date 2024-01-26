"use server";
import { cookies } from "next/headers";

export async function getPreferences() {
  const cookieStores = cookies();
  const cookiesArray = cookieStores.getAll();
  const cookiesString = cookiesArray
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join(";");

  const res = await fetch("http://localhost:3000/api/user/preferences", {
    method: "GET",
    headers: {
      Cookie: cookiesString,
    },
    credentials: "include",
  });

  const preferences = await res.json();
  return preferences;
}
