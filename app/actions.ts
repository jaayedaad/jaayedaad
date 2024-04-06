"use server";

import { isUsernameTaken } from "@/services/user";

export const isUsernameTakenAction = async (
  username: string
): Promise<boolean> => {
  return isUsernameTaken(username);
};
