import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { CID } from "multiformats/cid";
import { addressFromSolution, signatureFromSolution } from "../../lib/src/thc";
import { SignatureLike } from "ethers";
import { TreasureHuntCreator } from "../typechain";

export function cidToBytes(cid: string) {
  return CID.parse(cid).bytes;
}

export async function getSolutionAddress(solution: string) {
  return addressFromSolution(solution);
}

export async function getSolutionSignature(solution: string, address: string) {
  return await signatureFromSolution(solution, address as `0x${string}`);
}

export function encodeTokenId(thcAddress: string, badgeId: number): bigint {
  // Convert the thcAddress to a BigInt, assuming it's a hex string without the '0x' prefix
  const thcBigInt = BigInt(thcAddress);
  // Shift left by 96 bits
  const shiftedThcBigInt = thcBigInt << 96n;

  // Convert the badgeId to a BigInt
  const badgeBigInt = BigInt(badgeId);

  // Perform bitwise OR and return the result
  return shiftedThcBigInt | badgeBigInt;
}

export async function getSignature(
  signer: SignerWithAddress,
  solution: string
) {
  const sig = await signatureFromSolution(
    solution,
    signer.address as `0x${string}`
  );
  const address = addressFromSolution(solution);
  return [sig, address] as [SignatureLike, string];
}

export function merge(address: string, chapter: number) {
  const addressBigInt = BigInt(address);
  const chapterBigInt = BigInt(chapter);

  return (addressBigInt << 96n) | chapterBigInt;
}

export function leaderboardEntry(
  account: string,
  keys: number[],
  chapter: number
) {
  let keysBigInt = 0n;
  for (let index of keys) {
    keysBigInt |= 1n << BigInt(index);
  }

  return {
    account,
    keys: keysBigInt,
    chapter,
  };
}

export function parseLeaderboard(
  leaderboard: TreasureHuntCreator.LeaderboardEntryStructOutput[]
) {
  return leaderboard.map((entry) => ({
    account: entry[0],
    keys: entry[1],
    // chapter is a unit16 so it definitely fits a js number
    chapter: Number(entry[2]),
  }));
}
