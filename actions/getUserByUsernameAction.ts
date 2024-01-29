"use server";

import { prisma } from "@/lib/prisma";
export async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      assets: true,
      preferences: true,
    },
  });
  return user;
}
