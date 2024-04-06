import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/services/user";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "@/constants/env";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      const user = await getUserByEmail(token.email!);
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    newUser: "/auth/onboarding",
    signIn: "/",
    signOut: "/",
    error: "/",
  },
};
