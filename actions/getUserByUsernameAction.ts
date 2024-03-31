"use server";

import { prisma } from "@/lib/prisma";
import { decryptObjectValues } from "@/lib/dataSecurity";
export async function getUserByUsername(username: string) {
  let user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      assets: true,
      preferences: true,
    },
  });

  if (user) {
    const encryptionKey =
      user?.id.slice(0, 4) +
      process.env.SIA_ENCRYPTION_KEY +
      user?.id.slice(-4);

    user = {
      ...user,
      assets: decryptObjectValues(
        user?.assets,
        encryptionKey
      ) as typeof user.assets,
    };
    return user;
  }
}
