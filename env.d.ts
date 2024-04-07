declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Google Provider
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;

      // Deployment environment
      NODE_ENV: string;

      // Postgres db url
      DATABASE_URL: string;

      // Sia url
      SIA_API_URL: string;
      SIA_ADMIN_USERNAME: string;
      SIA_ADMIN_PASSWORD: string;

      // Sia data encryption key
      ENCRYPTION_KEY: string;

      // TWELVE DATA API KEY
      TWELVEDATA_API_KEY: string;

      NEXT_PUBLIC_POSTHOG_KEY: string;
      NEXT_PUBLIC_POSTHOG_HOST: string;
    }
  }
}

export {};
