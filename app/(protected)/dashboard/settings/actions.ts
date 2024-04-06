"use server";

import { authOptions } from "@/lib/authOptions";
import { TPreference } from "@/lib/types";
import { updatePreference } from "@/services/preference";
import { deleteUser } from "@/services/user";
import { getServerSession } from "next-auth";

export const updatePreferenceAction = async (
  preference: Partial<TPreference>
) => {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    return false;
  }

  const updatedPreference = await updatePreference(session.user.id, preference);
  return updatedPreference;
};

export const deleteUserAction = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    return false;
  }

  const deletedUser = await deleteUser(session.user.id);
  return deletedUser;
};
