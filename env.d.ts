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

      // Postgres db url
      DATABASE_URL: string;

      // Sia url
      SIA_API_URL: string;

      // Sia data encryption key
      SIA_ENCRYPTION_KEY: string;

      // TWELVE DATA API KEY
      NEXT_PUBLIC_TWELVEDATA_API_KEY: string;
    }
  }
}

export {};
