declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Google Provider
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      NEXTAUTH_SECRET: string;

      // Deployment environment
      NODE_ENV: string;
      NEXT_PUBLIC_APP_URL: string;

      // Prisma
      DATABASE_URL: string;

      // TWELVE DATA API KEY
      NEXT_PUBLIC_TWELVEDATA_API_KEY: string;
    }
  }
}

export {};
