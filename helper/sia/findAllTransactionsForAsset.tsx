import { TSiaObject } from "@/lib/types";

export default async function getTransactionsForAsset(
  userId: string,
  assetId: string
) {
  const username = "username";
  const password = "1234";
  const basicAuth =
    "Basic " + Buffer.from(username + ":" + password).toString("base64");

  const encryptionKey =
    userId.slice(0, 4) + process.env.SIA_ENCRYPTION_KEY + userId.slice(-4);

  const res = await fetch(
    `${process.env.SIA_API_URL}/workers/object/${userId}/assets/${assetId}/transactions/`,
    {
      method: "GET",
      headers: {
        Authorization: basicAuth,
      },
    }
  );

  if (!res.ok) {
    return false;
  } else {
    const response: TSiaObject[] = await res.json();
    const transactionAddressArray = response.map((res: TSiaObject) => res.name);

    const requests = transactionAddressArray.map((address) =>
      fetch(`${process.env.SIA_API_URL}/worker/objects${address}`, {
        method: "GET",
        headers: {
          AUthorization: basicAuth,
        },
      }).then((response) => response.json())
    );
    const responses = await Promise.all(requests);
  }
}
