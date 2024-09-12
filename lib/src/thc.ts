import { Hex, keccak256, parseSignature, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { stringToUint8Array } from "./utils";

export function walletFromSolution(solution: string) {
  const solutionRaw = stringToUint8Array(solution.trim().toLowerCase());
  const solutionHash = keccak256(toHex(solutionRaw));
  return privateKeyToAccount(solutionHash);
}

export function addressFromSolution(solution: string) {
  return walletFromSolution(solution).address;
}

export async function signatureFromSolution(
  solution: string,
  playerAddress: Hex
) {
  const wallet = walletFromSolution(solution);
  const sig = await wallet.signMessage({
    message: { raw: playerAddress },
  });
  return parseSignature(sig);
}
