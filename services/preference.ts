"use server";

import { prisma } from "@/lib/prisma";
import { TPreference } from "@/lib/types";

export const createPreference = async (
  userId: string
): Promise<TPreference> => {
  const preference = await prisma.preference.create({
    data: {
      userId,
    },
  });
  return preference;
};

export const getPreferenceFromUserId = async (
  userId: string
): Promise<TPreference | null> => {
  const preference = await prisma.preference.findUnique({
    where: {
      userId,
    },
  });
  return preference;
};

export const updatePreference = async (
  userId: string,
  preference: any
): Promise<TPreference> => {
  const updatedPreference = await prisma.preference.update({
    where: {
      userId,
    },
    data: preference,
  });
  return updatedPreference;
};
