"use server";

import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { decryptObjectValues } from "@/lib/dataSecurity";
import { DATABASE_URL, ENCRYPTION_KEY, USE_SIA } from "@/constants/env";
import { deleteUserInSia } from "./thirdParty/sia";

export const getUser = async (session: Session) => {
  if (!session.user || !session.user.email) {
    throw new Error("User not authenticated");
  }
  const user = await prisma.user.findUnique({
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
  if (!user) {
    throw new Error("User not found");
  }

  const encryptionKey =
    user.id.slice(0, 4) + ENCRYPTION_KEY + user.id.slice(-4);

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    whitelisted: user.whitelisted,
    usersManualCategories: decryptObjectValues(
      user.usersManualCategories,
      encryptionKey
    ) as typeof user.usersManualCategories,
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

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      usersManualCategories: {
        include: {
          assets: true,
        },
      },
    },
  });
  if (user) {
    const encryptionKey =
      user.id.slice(0, 4) + ENCRYPTION_KEY + user.id.slice(-4);

    return {
      usersManualCategories: decryptObjectValues(
        user.usersManualCategories,
        encryptionKey
      ) as typeof user.usersManualCategories,
      id: user?.id,
      name: user?.name,
      username: user?.username,
      email: user?.email,
      emailVerified: user?.emailVerified,
      whitelisted: user.whitelisted,
      image: user?.image,
    };
  }
};

export const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUser = async (
  email: string,
  data: {
    name?: string;
    username?: string;
    image?: string;
  }
) => {
  const user = await prisma.user.update({
    where: {
      email,
    },
    data,
  });
  return user;
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    if (USE_SIA) {
      deleteUserInSia(user.id);
    }
    if (DATABASE_URL) {
      await prisma.user.delete({
        where: { id: userId },
      });
    }
    return true;
  } catch {
    return false;
  }
};
