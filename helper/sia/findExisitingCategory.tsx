import {
  ENCRYPTION_KEY,
  SIA_ADMIN_PASSWORD,
  SIA_ADMIN_USERNAME,
  SIA_API_URL,
} from "@/constants/env";
import { TSiaObject } from "@/types/types";
import CryptoJS from "crypto-js";

export default async function findExistingCategoryFromSia(
  userId: string,
  categoryName: string
) {
  const username = SIA_ADMIN_USERNAME;
  const password = SIA_ADMIN_PASSWORD;
  const basicAuth =
    "Basic " + Buffer.from(username + ":" + password).toString("base64");

  const encryptionKey = userId.slice(0, 4) + ENCRYPTION_KEY + userId.slice(-4);

  const res = await fetch(
    `${SIA_API_URL}/worker/objects/${userId}/usersManualCategories/`,
    {
      method: "GET",
      headers: {
        Authorization: basicAuth,
      },
    }
  );

  if (res.ok) {
    const response: TSiaObject[] = await res.json();
    const categoryAddressArray = response.map((res: TSiaObject) => res.name);

    const requests = categoryAddressArray.map((address) =>
      fetch(`${SIA_API_URL}/worker/objects${address}`).then((response) =>
        response.json()
      )
    );
    const responses = await Promise.all(requests);

    let categoryId = false;
    responses.forEach((response) => {
      const encryptedData = response.data;

      // Decrypting the encrypted data
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      // Parsing decrypted data
      const decryptedObject = JSON.parse(decryptedData);
      console.log(decryptedObject);
      if (decryptedObject.name === categoryName) {
        categoryId = decryptedObject.id;
      }
    });

    return categoryId;
  } else {
    return false;
  }
}
