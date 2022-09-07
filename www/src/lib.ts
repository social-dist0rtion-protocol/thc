import { BigNumber, Wallet } from "ethers";
import {
  arrayify,
  keccak256,
  splitSignature,
  toUtf8Bytes,
} from "ethers/lib/utils";
import type { TreasureHuntCreator } from "../../eth/typechain";

export function shortAddress(a: string) {
  return a.substring(0, 6) + "…" + a.substring(16, 20);
}

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

export async function parseLeaderboard(thc: TreasureHuntCreator) {
  function parse(value: BigNumber) {
    const address = value.div(BigNumber.from(2).pow(96)).toHexString();
    const chapter = value.mask(96).toNumber();

    return { address: address, chapter };
  }
  async function getLeaderboard() {
    const ZERO = BigNumber.from(0);
    const leaderboard = [];
    let page = 0;
    while (true) {
      const items = await thc.getLeaderboard(page);
      for (let entry of items) {
        if (entry.eq(ZERO)) {
          return leaderboard;
        } else {
          leaderboard.push(parse(entry));
        }
      }
      page++;
    }
  }

  const leaderboard = await getLeaderboard();
  leaderboard.sort((a, b) => b.chapter - a.chapter);
  return leaderboard;
}
