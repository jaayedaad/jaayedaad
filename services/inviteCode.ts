"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getUser } from "./user";

// function to check invite code
export const checkInviteCode = async (inviteCode: string) => {
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
};

// function to verify invite code
export const validateInviteCode = async (validatedInviteCode: {
  id: string;
  code: string;
  usesLeft: number;
  senderEmail: string;
}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return false;
  } else {
    // check if the invite code has uses left
    if (validatedInviteCode.usesLeft === 0) {
      return false;
    } else {
      const user = await getUser(session);
      await prisma.user.update({
        where: {
          email: user.email,
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
              email: user.email,
            },
          },
        },
      });
      return true;
    }
  }
};
