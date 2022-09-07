import { Wallet } from "ethers";
import {
  arrayify,
  keccak256,
  splitSignature,
  toUtf8Bytes,
} from "ethers/lib/utils";

export async function signatureFromSolution(address: string, solution: string) {
  solution = solution.toLowerCase();

  // Generate the hash of the value
  const hash = keccak256(toUtf8Bytes(solution));

  // Generate wallet using the 32 bytes from the hash
  const solutionWallet = new Wallet(hash);

  // Sign the raw bytes, not the hex string
  const signature = await solutionWallet.signMessage(arrayify(address));
  return splitSignature(signature);
}
