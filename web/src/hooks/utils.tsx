import { keccak256, toBytes } from "viem";
import { signMessage } from "viem/accounts";

export async function signatureFromSolution(
  address: `0x${string}`,
  solution: string
) {
  solution = solution.toLowerCase();
  const privateKey = keccak256(toBytes(solution));
  const signature = await signMessage({
    message: address,
    privateKey: privateKey,
  });
  const r = ("0x" + signature.slice(2, 66)) as `0x${string}`; // First 32 bytes (64 hex characters)
  const s = ("0x" + signature.slice(66, 130)) as `0x${string}`; // Next 32 bytes (64 hex characters)
  const v = parseInt(signature.slice(130, 132), 16); // The last byte (2 hex characters)

  return { r, s, v };
}
