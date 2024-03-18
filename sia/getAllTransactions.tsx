import { siaObject } from "@/helper/sia/findExisitingAsset";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import CryptoJS from "crypto-js";

export default async function getAllTransactions(assetId: string) {
  const session = await getServerSession(authOptions);
  const username = "username";
  const password = "1234";
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
        user.id.slice(0, 4) +
        process.env.SIA_ENCRYPTION_KEY +
        user.id.slice(-4);

      const res = await fetch(
        `${process.env.SIA_API_URL}/worker/objects/${user.id}/assets/${assetId}/transactions/`,
        {
          method: "GET",
          headers: {
            Authorization: basicAuth,
          },
        }
      );

      const response: siaObject[] = await res.json();

      const transactionAddressArray = response.map(
        (res: siaObject) => res.name
      );

      const requests = transactionAddressArray.map((address) =>
        fetch(`${process.env.SIA_API_URL}/worker/objects${address}`, {
          method: "GET",
          headers: {
            Authorization: basicAuth,
          },
        }).then((response) => response.json())
      );

      const responses = await Promise.all(requests);

      const transactions = responses.map((response) => {
        const encryptedData = response.data;

        // Decrypting the encrypted data
        const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
        const transaction = bytes.toString(CryptoJS.enc.Utf8);

        // Parsing decrypted data
        const decryptedObject = JSON.parse(transaction);
        return decryptedObject;
      });

      return transactions;
    }
  }
}
