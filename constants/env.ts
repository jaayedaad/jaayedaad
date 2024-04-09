export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
export const DATABASE_URL = process.env.DATABASE_URL;
export const USE_SIA =
  process.env.USE_SIA === "1" &&
  process.env.SIA_API_URL &&
  process.env.SIA_API_URL.length > 0 &&
  process.env.SIA_ADMIN_USERNAME &&
  process.env.SIA_ADMIN_PASSWORD
    ? true
    : false;
export const SIA_API_URL =
  process.env.SIA_API_URL && process.env.SIA_API_URL.length > 0
    ? process.env.SIA_API_URL
    : undefined;
export const SIA_ADMIN_USERNAME = process.env.SIA_ADMIN_USERNAME;
export const SIA_ADMIN_PASSWORD = process.env.SIA_ADMIN_PASSWORD;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY;
