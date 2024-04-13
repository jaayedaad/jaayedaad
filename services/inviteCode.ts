"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// TODO: move the getSession function to an action and wrap it!
export const checkInviteCode = async (inviteCode: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return false;
    } else {
      const foundInviteCode = await prisma.inviteCode.findUnique({
        where: {
          code: inviteCode,
        },
      });
      if (!foundInviteCode) {
        return false;
      }
      return foundInviteCode;
    }
  } catch (err) {
    console.error("Error in checkInviteCode: " + inviteCode + err);
    return false;
  }
};

// function to verify invite code
export const validateInviteCode = async (validatedInviteCode: {
  id: string;
  code: string;
  usesLeft: number;
  senderEmail: string;
}): Promise<boolean> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return false;
    } else {
      // check if the invite code has uses left
      if (validatedInviteCode.usesLeft === 0) {
        return false;
      } else {
        const user = session.user;
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            whitelisted: true,
          },
        });
        await prisma.inviteCode.update({
          where: {
            id: validatedInviteCode.id,
          },
          data: {
            usesLeft: validatedInviteCode.usesLeft - 1,
            usersInvited: {
              create: {
                userId: user.id,
              },
            },
          },
        });
        return true;
      }
    }
  } catch (err) {
    console.error("Error in validateInviteCode: " + validatedInviteCode + err);
    return false;
  }
};
