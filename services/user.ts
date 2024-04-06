"use server";

import { prisma } from "@/lib/prisma";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { decryptObjectValues } from "@/lib/dataSecurity";
import { SIA_ENCRYPTION_KEY } from "@/constants/env";

export const getUser = async (session: Session) => {
  if (!session.user || !session.user.email) {
    throw new Error("User not authenticated");
  }
  const foundUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      usersManualCategories: {
        include: {
          assets: true,
        },
      },
    },
  });
  if (!foundUser) {
    throw new Error("User not found");
  }

  const encryptionKey =
    foundUser.id.slice(0, 4) + SIA_ENCRYPTION_KEY + foundUser.id.slice(-4);

  return {
    id: foundUser.id,
    name: foundUser.name,
    username: foundUser.username,
    email: foundUser.email,
    emailVerified: foundUser.emailVerified,
    image: foundUser.image,
    whitelisted: foundUser.whitelisted,
    usersManualCategories: decryptObjectValues(
      foundUser.usersManualCategories,
      encryptionKey
    ) as typeof foundUser.usersManualCategories,
  };
};

export const isUsernameTaken = async (username: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  return user ? true : false;
};
