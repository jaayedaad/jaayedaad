import {
  ENCRYPTION_KEY,
  SIA_ADMIN_PASSWORD,
  SIA_ADMIN_USERNAME,
  SIA_API_URL,
} from "@/constants/env";
import CryptoJS from "crypto-js";

export async function getAssetById(userId: string, assetId: string) {
  const username = SIA_ADMIN_USERNAME;
  const password = SIA_ADMIN_PASSWORD;
  const basicAuth =
    "Basic " + Buffer.from(username + ":" + password).toString("base64");

  const encryptionKey = userId.slice(0, 4) + ENCRYPTION_KEY + userId.slice(-4);
  // get asset to sell from sia
  const assetResponse = await fetch(
    `${SIA_API_URL}/worker/objects/${userId}/assets/${assetId}/data`,
    {
      method: "GET",
      headers: {
        Authorization: basicAuth,
      },
    }
  );
  const encryptedAssetData = await assetResponse.json();
  // Decrypting the encrypted data
  const bytes = CryptoJS.AES.decrypt(encryptedAssetData.data, encryptionKey);
  const decryptedAssetData = bytes.toString(CryptoJS.enc.Utf8);

  return JSON.parse(decryptedAssetData);
}
