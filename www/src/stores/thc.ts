import { arrayify, base58, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import {
  derived,
  get,
  writable,
  type Readable,
  type Writable,
} from "svelte/store";
import { TreasureHuntCreator__factory } from "../../../eth/typechain";
import { signer } from "./burnerWallet";
import { chapters, contractsAddresses, ipfsGateway } from "./config";
import { writableLocalStorage } from "./x";
import CryptoJS from "crypto-js";
import { retry, retryWrap } from "./x/retry";
import { marked } from "marked";
import { parseLeaderboard } from "../lib";

export const lastTransactionMined: Writable<null | string> =
  writableLocalStorage("lastTransactionMined", null);
export const currentSolution: Writable<null | string> = writableLocalStorage(
  "currentSolution",
  null
);

export const thc = derived(
  signer,
  ($signer) => {
    return $signer
      ? TreasureHuntCreator__factory.connect(
          contractsAddresses["TreasureHuntCreator"],
          $signer
        )
      : null;
  },
  null
);

export const totalChapters: Readable<null | number> = derived(
  thc,
  ($thc, set) => {
    if ($thc) {
      retry(async () => {
        set((await $thc.totalChapters()).toNumber());
      });
    }
  }
);

export const currentChapter: Readable<null | number> = derived(
  [thc, lastTransactionMined],
  ([$thc], set: (v: null | number) => void) => {
    if ($thc) {
      retry(async () => {
        set((await $thc.currentChapter()).toNumber());
      });
    } else {
      set(null);
    }
  },
  null
);

export const fuckFuckFuckFuckFuck = writable(false);

export const currentQuest: Readable<string | null> = derived(
  [thc, currentChapter],
  ([$thc, $currentChapter], set) => {
    const $currentSolution = get(currentSolution);
    console.log("Load new quest", $currentSolution, $currentChapter);
    if ($thc && $currentChapter !== null) {
      /*
        const hashAddress = await $thc.currentQuest();
        const completeHashAddress = hashAddress.replace("0x", "0x1220");
        const hashBuffer = arrayify(completeHashAddress);
        const ipfsHash = base58.encode(hashBuffer);
        console.log(ipfsHash, ipfsGateway);
        const ipfsUrl = new URL(ipfsHash, ipfsGateway);
        const response = await fetch(ipfsUrl);
        console.log("IPFS response:", response);
        const quest = await response.text();
        */

      const { quest } = chapters[$currentChapter];

      if ($currentSolution !== null) {
        const key = keccak256(toUtf8Bytes($currentSolution));
        let plainQuest: string;
        try {
          const bytes = CryptoJS.AES.decrypt(quest, key.toString());
          plainQuest = bytes.toString(CryptoJS.enc.Utf8);
        } catch (e: any) {
          set(
            "Sorry, we had to restart the game, you need to reset your session using the button below"
          );
          fuckFuckFuckFuckFuck.set(true);
          return;
        }
        set(plainQuest);
      } else {
        // The first quest is not encrypted
        set(quest);
      }
    }
  }
);

export const currentQuestHtml = derived(currentQuest, ($currentQuest) =>
  $currentQuest ? marked($currentQuest) : null
);

export const leaderboard: Readable<Awaited<
  ReturnType<typeof parseLeaderboard>
> | null> = derived(thc, ($thc, set) => {
  if ($thc) {
    const update = retryWrap(async () => {
      set(await parseLeaderboard($thc));
    });
    const timerId = window.setInterval(update, 10000);
    update();
    return () => window.clearInterval(timerId);
  } else {
    set(null);
  }
});
