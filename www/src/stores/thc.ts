import { arrayify, base58, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import {
  derived,
  get,
  writable,
  type Readable,
  type Writable,
} from "svelte/store";
import { CID } from "multiformats";

import { TreasureHuntCreator__factory } from "../../../eth/typechain";
import { signer } from "./burnerWallet";
import { contractsAddresses, ipfsGateway } from "./config";
import { writableLocalStorage } from "./x";
import CryptoJS from "crypto-js";
import { retry, retryWrap } from "./x/retry";
import { marked } from "marked";
import { parseLeaderboard } from "../lib";
import { RecoverableError } from "./x/exceptions";

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

export const questsRootCID: Readable<string | null> = derived(
  thc,
  ($thc, set) => {
    if ($thc) {
      retry(async () => {
        const cid = await $thc.getQuestsRootCID();
        const hashBuffer = arrayify(cid);
        const ipfsHash = CID.decode(hashBuffer).toV0().toString();
        set(ipfsHash);
      }, true);
    }
  }
);

export const totalChapters: Readable<null | number> = derived(
  thc,
  ($thc, set) => {
    if ($thc) {
      retry(async () => {
        set((await $thc.totalChapters()).toNumber());
      }, true);
    }
  }
);

export const currentChapter: Readable<null | number> = derived(
  [thc, lastTransactionMined],
  ([$thc], set: (v: null | number) => void) => {
    if ($thc) {
      retry(async () => {
        set((await $thc.currentChapter()).toNumber());
      }, true);
    } else {
      set(null);
    }
  },
  null
);

export const currentQuest: Readable<string | null> = derived(
  [questsRootCID, currentChapter],
  ([$questsRootCID, $currentChapter], set) => {
    const $currentSolution = get(currentSolution);
    console.log("Load new quest", $currentSolution, $currentChapter);
    if ($questsRootCID && $currentChapter !== null) {
      retry(async () => {
        const ipfsUrl = new URL(
          $questsRootCID + "/" + $currentChapter,
          ipfsGateway
        );
        let quest: string;
        try {
          const response = await fetch(ipfsUrl);
          console.log("IPFS response:", response);
          quest = await response.text();
        } catch (e) {
          console.log(e);
          throw RecoverableError;
        }
        if ($currentSolution !== null) {
          const key = keccak256(toUtf8Bytes($currentSolution));
          const bytes = CryptoJS.AES.decrypt(quest, key.toString());
          const plainQuest = bytes.toString(CryptoJS.enc.Utf8);
          set(plainQuest);
        } else {
          // The first quest is not encrypted
          set(quest);
        }
      });
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
