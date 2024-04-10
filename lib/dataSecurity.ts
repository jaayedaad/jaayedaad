import CryptoJS from "crypto-js";

// Function to encrypt data
export function encryptDataValue(text: string, secretKey: string): string {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  return encrypted;
}

// Function to decrypt data
export function decryptDataValue(
  encryptedText: string,
  secretKey: string
): string {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  return decrypted;
}

// Function to recursively encrypt object values, including arrays
export function encryptObjectValues(obj: any, secretKey: string) {
  for (let key in obj) {
    if (
      ![
        "id",
        "userId",
        "assetId",
        "type",
        "manualCategoryId",
        "date",
        "buyDate",
      ].includes(key)
    ) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          // If the property is an array, iterate through its elements
          obj[key].forEach((element: any, index: number) => {
            if (typeof element === "object" && element !== null) {
              obj[key][index] = encryptObjectValues(element, secretKey);
            } else if (typeof element === "string") {
              obj[key][index] = encryptDataValue(element, secretKey);
            }
          });
        } else {
          // If the property is an object, recursively encrypt its values
          obj[key] = encryptObjectValues(obj[key], secretKey);
        }
      } else if (typeof obj[key] === "string") {
        // Encrypt string values
        obj[key] = encryptDataValue(obj[key], secretKey);
      }
    }
  }
  return obj;
}

// Function to recursively decrypt object values, including arrays
export function decryptObjectValues(obj: any, secretKey: string) {
  for (let key in obj) {
    if (
      ![
        "id",
        "userId",
        "assetId",
        "type",
        "manualCategoryId",
        "date",
        "buyDate",
      ].includes(key)
    ) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          // If the property is an array, iterate through its elements
          obj[key].forEach((element: any, index: number) => {
            if (typeof element === "object" && element !== null) {
              obj[key][index] = decryptObjectValues(element, secretKey);
            } else if (typeof element === "string") {
              obj[key][index] = decryptDataValue(element, secretKey);
            }
          });
        } else {
          // If the property is an object, recursively decrypt its values
          obj[key] = decryptObjectValues(obj[key], secretKey);
        }
      } else if (typeof obj[key] === "string") {
        // Decrypt string values
        obj[key] = decryptDataValue(obj[key], secretKey);
      }
    }
  }
  return obj;
}
