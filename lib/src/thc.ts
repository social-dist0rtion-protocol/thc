import { Hex, keccak256, parseSignature } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { stringToUint8Array } from "./utils";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

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
  rawLeaderboard: LeaderboardEntry[],
  prevPage = 0,
  prevLeaderboard: LeaderboardEntry[] = []
) {
  const nextPage =
    rawLeaderboard[rawLeaderboard.length - 1].account === ADDRESS_ZERO
      ? null
      : prevPage + 1;

  const processed = rawLeaderboard.map((entry) => ({
    ...entry,
    // timestamp is uint64 but I'm quite sure we will be all dead way before
    // we reach that amount of bits
    timestamp: Number(entry.timestamp),
  }));

  const leaderboard = [
    ...prevLeaderboard,
    ...processed.filter((x) => x.account !== ADDRESS_ZERO),
  ];

  if (nextPage === null) {
    leaderboard.sort((a, b) => b.timestamp - a.timestamp);
  }

  return {
    leaderboard,
    nextPage,
  } as Leaderboard;
}
