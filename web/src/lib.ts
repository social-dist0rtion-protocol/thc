export { decrypt } from "../../lib/src/aes";
export { signatureFromSolution } from "../../lib/src/thc";
import { addressFromSolution } from "../../lib/src/thc";
import metadata from "./metadata.json";

export function b(n: number) {
  return BigInt(2) ** BigInt(n) - BigInt(1);
}

export function checkSolutionMatch(solution: string, chapterIndex?: number) {
  if (chapterIndex !== undefined)
    return addressFromSolution(solution) === metadata.chapters[chapterIndex];

  return false;
}

export function checkKeyMatch(solution: string) {
  const solutionAddress = addressFromSolution(solution);
  for (let i = 0; i < metadata.keys.length; i++) {
    if (metadata.keys[i].address === solutionAddress) {
      return true;
    }
  }
  return false;
}
