"use server";

import { isUsernameTaken } from "@/services/user";

export const checkUsernameAvailabilityAction = async (
  username: string
): Promise<boolean> => {
  return isUsernameTaken(username);
};
