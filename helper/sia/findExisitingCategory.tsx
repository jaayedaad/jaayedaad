import { TSiaObject } from "@/lib/types";
import CryptoJS from "crypto-js";

export default async function findExistingCategoryFromSia(
  userId: string,
  categoryName: string
) {
  const username = "username";
  const password = "1234";
  const basicAuth =
    "Basic " + Buffer.from(username + ":" + password).toString("base64");

  const encryptionKey =
    userId.slice(0, 4) + process.env.SIA_ENCRYPTION_KEY + userId.slice(-4);

  const res = await fetch(
    `${process.env.SIA_API_URL}/workers/object/${userId}/usersManualCategories/`,
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
      fetch(`${process.env.SIA_API_URL}/worker/objects${address}`).then(
        (response) => response.json()
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
      if (decryptedObject.name === categoryName) {
        categoryId = decryptedObject.id;
      }
    });

    return categoryId;
  } else {
    return false;
  }
}
