import { arrayify, base58, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { derived, type Readable, type Writable } from "svelte/store";
import { TreasureHuntCreator__factory } from "../../../eth/typechain";
import { signer } from "./burnerWallet";
import { contractsAddresses, ipfsGateway } from "./config";
import { writableLocalStorage } from "./x";
import CryptoJS from "crypto-js";
import { retry } from "./x/retry";
import { marked } from "marked";

export const lastTransactionMined = writableLocalStorage(
  "lastTransactionMined",
  null
);
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
  ([$thc], set) => {
    if ($thc) {
      retry(async () => {
        set((await $thc.currentChapter()).toNumber());
      });
    }
  }
);

export const currentQuest: Readable<string | null> = derived(
  [thc, currentSolution, lastTransactionMined],
  ([$thc, $currentSolution], set) => {
    if ($thc) {
      retry(async () => {
        const hashAddress = await $thc.currentQuest();
        const completeHashAddress = hashAddress.replace("0x", "0x1220");
        const hashBuffer = arrayify(completeHashAddress);
        const ipfsHash = base58.encode(hashBuffer);
        console.log(ipfsHash, ipfsGateway);
        const ipfsUrl = new URL(ipfsHash, ipfsGateway);
        const response = await fetch(ipfsUrl);
        console.log("IPFS response:", response);
        const quest = await response.text();

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
