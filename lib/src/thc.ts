import { keccak256, toHex } from "viem";
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
