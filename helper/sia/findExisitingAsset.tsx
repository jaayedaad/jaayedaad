import {
  ENCRYPTION_KEY,
  SIA_ADMIN_PASSWORD,
  SIA_ADMIN_USERNAME,
  SIA_API_URL,
} from "@/constants/env";
import { TSiaObject } from "@/types/types";
import { Asset, AssetSource } from "@prisma/client";
import CryptoJS from "crypto-js";

export default async function findExistingAssetFromSia(
  userId: string,
  assetSymbol: string,
  assetName: string,
  source: AssetSource
) {
  const username = SIA_ADMIN_USERNAME;
  const password = SIA_ADMIN_PASSWORD;
  const basicAuth =
    "Basic " + Buffer.from(username + ":" + password).toString("base64");

  const encryptionKey = userId.slice(0, 4) + ENCRYPTION_KEY + userId.slice(-4);
  const res = await fetch(`${SIA_API_URL}/worker/objects/${userId}/assets/`, {
    method: "GET",
    headers: {
      Authorization: basicAuth,
    },
  });

  let existingAsset: Asset | undefined;

  if (!res.ok) {
    return existingAsset;
  } else {
    const response: TSiaObject[] = await res.json();
    const assetAddressArray = response.map((res: TSiaObject) => res.name);

    const requests = assetAddressArray.map((address) =>
      fetch(`${SIA_API_URL}/worker/objects${address}data`, {
        method: "GET",
        headers: {
          AUthorization: basicAuth,
        },
      }).then((response) => response.json())
    );
    const responses = await Promise.all(requests);

    responses.forEach((response) => {
      const encryptedData = response.data;

      // Decrypting the encrypted data
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      // Parsing decrypted data
      const decryptedObject = JSON.parse(decryptedData);
      if (source !== "manual") {
        if (decryptedObject.symbol === assetSymbol) {
          existingAsset = decryptedObject;
        }
      } else {
        if (decryptedObject.name === assetName) {
          existingAsset = decryptedObject;
        }
      }
    });
    return existingAsset;
  }
}
