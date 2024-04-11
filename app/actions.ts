"use server";

import { isUsernameTaken, updateUser } from "@/services/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const isUsernameTakenAction = async (
  username: string
): Promise<boolean> => {
  return isUsernameTaken(username);
};

export const updateUsernameAction = async (
  username: string
): Promise<boolean> => {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    return false;
  }

  const usernameIsValid = await verifyUsernameAction(username);
  if (usernameIsValid !== "Username available") {
    return false;
  }

  const updatedUser = await updateUser(session.user.email, { username });
  if (!updatedUser) {
    return false;
  }
  return true;
};

export async function verifyUsernameAction(username: string): Promise<string> {
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(username)) {
    return "Username can only contain alphanumeric characters or underscores!";
  } else if (username.length < 3) {
    return "Username must be at least 3 characters!";
  }

  const isUsernameTaken = await isUsernameTakenAction(username);
  return !isUsernameTaken
    ? "Username available"
    : "This username is already taken!";
}
