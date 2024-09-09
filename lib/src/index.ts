import { crypto } from "./cryptoUtils";

// Function to encrypt data using AES-GCM and embed the IV
export async function encrypt(
  data: string,
  key: CryptoKey
): Promise<ArrayBuffer> {
  const encoded = new TextEncoder().encode(data);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12-byte IV for AES-GCM

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv); // Set IV at the start
  combined.set(new Uint8Array(encrypted), iv.length); // Append encrypted data

  return combined.buffer;
}

// Function to decrypt data using AES-GCM, extracting the IV from the combined output
export async function decrypt(
  combined: ArrayBuffer,
  key: CryptoKey
): Promise<string> {
  const combinedArray = new Uint8Array(combined);
  const iv = combinedArray.slice(0, 12); // Extract the IV (first 12 bytes)
  const encrypted = combinedArray.slice(12); // Extract the encrypted data

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}

export async function generateKey() {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}
