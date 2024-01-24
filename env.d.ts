declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Google Provider
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      NEXTAUTH_SECRET: string;

      // Prisma
      DATABASE_URL: string;

      // YH Finance
      NEXT_PUBLIC_YHFINANCE_KEY: string;
    }
  }
}

export {};
