"use server";
import { cookies } from "next/headers";

export async function getCurrentUser() {
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
