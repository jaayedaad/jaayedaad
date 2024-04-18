import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import CryptoJS from "crypto-js";
import { TSiaObject } from "@/types/types";
import {
  ENCRYPTION_KEY,
  SIA_ADMIN_PASSWORD,
  SIA_ADMIN_USERNAME,
  SIA_API_URL,
} from "@/constants/env";

export default async function getAllPriceUpdates(assetId: string) {
  const session = await getServerSession(authOptions);
  const username = SIA_ADMIN_USERNAME;
  const password = SIA_ADMIN_PASSWORD;
  const basicAuth =
    "Basic " + Buffer.from(username + ":" + password).toString("base64");

  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user.email!,
      },
    });
    if (user) {
      const encryptionKey =
        user.id.slice(0, 4) + ENCRYPTION_KEY + user.id.slice(-4);

      const res = await fetch(
        `${SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}/assetPriceUpdates/`,
        {
          method: "GET",
          headers: {
            Authorization: basicAuth,
          },
        }
      );

      const response: TSiaObject[] = await res.json();

      const priceUpdatesAddressArray = response.map(
        (res: TSiaObject) => res.name
      );

      const requests = priceUpdatesAddressArray.map((address) =>
        fetch(`${SIA_API_URL}/worker/objects${address}`, {
          method: "GET",
          headers: {
            Authorization: basicAuth,
          },
        }).then((response) => response.json())
      );

      const responses = await Promise.all(requests);

      const priceUpdates = responses.map((response) => {
        const encryptedData = response.data;

        // Decrypting the encrypted data
        const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
        const priceUpdate = bytes.toString(CryptoJS.enc.Utf8);

        // Parsing decrypted data
        const decryptedObject = JSON.parse(priceUpdate);
        return decryptedObject;
      });

      return priceUpdates;
    }
  }
}
