"use server";

import { prisma } from "@/lib/prisma";
import { TPreference } from "@/types/types";

export const createDefaultPreference = async (
  userId: string
): Promise<TPreference> => {
  try {
    const preference = await prisma.preference.create({
      data: {
        userId,
      },
    });
    return preference;
  } catch (err) {
    console.error("Error in createPreference: " + userId + err);
    throw new Error("Error in createPreference: " + userId + err);
  }
};

export const getPreferenceFromUserId = async (
  userId: string
): Promise<TPreference | null> => {
  try {
    const preference = await prisma.preference.findUnique({
      where: {
        userId,
      },
    });
    return preference;
  } catch (err) {
    console.error("Error in getPreferenceFromUserId: " + userId + err);
    return null;
  }
};

export const updatePreference = async (
  userId: string,
  preference: Partial<TPreference>
): Promise<TPreference> => {
  try {
    const updatedPreference = await prisma.preference.update({
      where: {
        userId,
      },
      data: preference,
    });
    return updatedPreference;
  } catch (err) {
    console.error("Error in updatePreference: " + userId + err);
    throw new Error("Error in updatePreference: " + userId + err);
  }
};
