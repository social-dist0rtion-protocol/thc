import { crypto } from "./cryptoUtils";

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

export async function encrypt(data: Uint8Array, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12-byte IV for AES-GCM

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  );

  // Combine IV and encrypted data into one Uint8Array
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv); // Set IV at the start
  combined.set(new Uint8Array(encrypted), iv.length); // Append encrypted data

  return combined;
}

export async function decrypt(combined: Uint8Array, key: CryptoKey) {
  const iv = combined.slice(0, 12); // Extract the IV (first 12 bytes)
  const encrypted = combined.slice(12); // Extract the encrypted data

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encrypted
  );

  return new Uint8Array(decrypted);
}

export async function encryptText(data: string, key: CryptoKey) {
  const encodedData = new TextEncoder().encode(data);
  const encrypted = await encrypt(encodedData, key);
  return uint8ArrayToBase64(encrypted);
}

export async function decryptText(encryptedText: string, key: CryptoKey) {
  const encryptedData = base64ToUint8Array(encryptedText);
  const decrypted = await decrypt(encryptedData, key);
  return new TextDecoder().decode(decrypted);
}

function uint8ArrayToBase64(bytes: Uint8Array) {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary);
}

function base64ToUint8Array(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
