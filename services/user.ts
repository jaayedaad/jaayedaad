"use server";

import { prisma } from "@/lib/prisma";
import { decryptObjectValues } from "@/lib/dataSecurity";
import { DATABASE_URL, ENCRYPTION_KEY, USE_SIA } from "@/constants/env";
import { deleteUserInSia } from "./thirdParty/sia";

export const isUsernameTaken = async (username: string): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user ? true : false;
  } catch (err) {
    console.error("Error in isUsernameTaken: " + username + err);
    return true;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
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
    if (!user) {
      throw new Error("User not found with email: " + email);
    }
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
  } catch (err) {
    console.error("Error in getUserByEmail: " + email + err);
    return null;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      throw new Error("User not found by username" + username);
    }

    return user;
  } catch (err) {
    console.error("Error in getUserByUsername: " + username + err);
    return null;
  }
};

export const updateUser = async (
  email: string,
  data: {
    name?: string;
    username?: string;
    image?: string;
  }
) => {
  try {
    const user = await prisma.user.update({
      where: {
        email,
      },
      data,
    });
    return user;
  } catch (err) {
    console.error("Error in updateUser with email: " + email + err);
    return null;
  }
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
  } catch (err) {
    console.error("Error in deleteUser with Id: " + userId + err);
    return false;
  }
};
