import { Hex, keccak256, parseSignature } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { stringToUint8Array } from "./utils";
import { TreasureHuntCreator } from "../../eth/typechain";

export function walletFromSolution(solution: string) {
  const solutionRaw = stringToUint8Array(solution.trim().toLowerCase());
  const solutionHash = keccak256(solutionRaw);
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

export type LeaderboardEntry = {
  account: `0x${string}`;
  keys: bigint;
  chapter: number;
  timestamp: number;
};

export type Leaderboard = {
  leaderboard: LeaderboardEntry[];
  nextPage: number | null;
};

export function processLeaderboard(
  rawLeaderboard: TreasureHuntCreator.LeaderboardEntryStructOutput[],
  prevPage = 0,
  prevLeaderboard: LeaderboardEntry[] = []
) {
  const nextPage =
    rawLeaderboard[rawLeaderboard.length - 1][0] !==
    "0x0000000000000000000000000000000000000000"
      ? prevPage + 1
      : null;

  const processed = rawLeaderboard.map((entry) => ({
    account: entry[0],
    keys: entry[1],
    // chapter is a unit16 so it definitely fits a js number
    chapter: Number(entry[2]),
    // timestamp is uint64 but I'm quite sure we will be all dead way before
    // we reach that amount of bits
    timestamp: Number(entry[3]),
  }));

  const leaderboard = [...prevLeaderboard, ...processed];

  if (nextPage === null) {
    leaderboard.sort((a, b) => b.timestamp - a.timestamp);
  }

  return {
    leaderboard,
    nextPage,
  } as Leaderboard;
}
