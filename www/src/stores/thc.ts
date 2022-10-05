import { arrayify, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import {
  derived,
  get,
  writable,
  type Readable,
  type Writable,
} from "svelte/store";
import { CID } from "multiformats";
import { TreasureHuntCreator__factory } from "../../../eth/typechain";
import { provider, signer } from "./burnerWallet";
import { contractsAddresses, ipfsGateway } from "./config";
import { writableLocalStorage } from "./x";
import CryptoJS from "crypto-js";
import { retry, retryWrap } from "./x/retry";
import { marked } from "marked";
import { parseLeaderboard } from "../lib";
import { RecoverableError } from "./x/exceptions";
import db from "./x/db";

export type Chapter = {
  solution: string | null;
  questHash: string | null;
  questHashLastSeen: string | null;
  transactionHash: string | null;
};

// Chapter should be a number, but we store it as JSON so it's easier to cast it
// to string
export type Game = { [chapter: string]: Chapter };

export const game = writableLocalStorage("game", {} as Game);

export type Chapter = {
  solution: string | null;
  questHash: string | null;
  questHashLastSeen: string | null;
  transactionHash: string | null;
};

// Chapter should be a number, but we store it as JSON so it's easier to cast it
// to string
export type Game = { [chapter: string]: Chapter };

export const game = writableLocalStorage("game", {} as Game);

export const lastTransactionMined: Writable<null | string> =
  writableLocalStorage("lastTransactionMined", null);

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
      const update = retryWrap(async () => {
        const cid = await $thc.getQuestsRootCID();
        const hashBuffer = arrayify(cid);
        const ipfsHash = CID.decode(hashBuffer).toV0().toString();
        console.log("Update quests root CID", ipfsHash);
        set(ipfsHash);
      }, true);
      const timerId = window.setInterval(update, 30000);
      update();
      return () => window.clearInterval(timerId);
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

export const fuckFuckFuckFuckFuck = writable(false);

export const currentQuest: Readable<string | null> = derived(
  [questsRootCID, currentChapter],
  ([$questsRootCID, $currentChapter], set) => {
    if ($questsRootCID && $currentChapter !== null) {
      const currentChapterString = $currentChapter.toString();
      const $game = get(game);

      if (!(currentChapterString in $game)) {
        $game[currentChapterString] = {
          solution: null,
          questHash: null,
          questHashLastSeen: null,
          transactionHash: null,
        };
        game.set($game);
      }

      console.log("Load new quest", $currentChapter, $game);

      let solution: string | null = null;
      try {
        if ($currentChapter > 0) {
          solution = $game[($currentChapter - 1).toString()].solution;
        }
      } catch (e) {
        console.error("current quest error", e);
        fuckFuckFuckFuckFuck.set(true);
        return;
      }
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
        if (solution !== null) {
          console.log("solution is", solution);
          const key = keccak256(toUtf8Bytes(solution));
          const bytes = CryptoJS.AES.decrypt(quest, key.toString());
          quest = bytes.toString(CryptoJS.enc.Utf8);
          set(quest);
        } else {
          // The first quest is not encrypted
          set(quest);
        }

        $game[currentChapterString].questHash = keccak256(toUtf8Bytes(quest));
        if ($game[currentChapterString].questHashLastSeen === null) {
          $game[currentChapterString].questHashLastSeen =
            $game[currentChapterString].questHash;
        }
        game.set($game);
      });
    }
  }
);

export const currentQuestHtml = derived(currentQuest, ($currentQuest) =>
  $currentQuest ? marked($currentQuest) : null
);

export const currentQuestHash = derived(currentQuest, ($currentQuest) =>
  $currentQuest ? keccak256(toUtf8Bytes($currentQuest)) : null
);

export const currentQuestLastSeenHash = writableLocalStorage<string | null>(
  "currentQuestLastSeenHash",
  null
);

let leaderboardTimerId = -1;

export const leaderboard: Readable<Awaited<
  ReturnType<typeof parseLeaderboard>
> | null> = derived(thc, ($thc, set) => {
  window.clearInterval(leaderboardTimerId);
  if ($thc) {
    const update = retryWrap(async () => {
      set(await parseLeaderboard($thc));
    });
    leaderboardTimerId = window.setInterval(update, 10000);
    update();
    return () => window.clearInterval(leaderboardTimerId);
  } else {
    set(null);
  }
});

export type ENSAddresses = {
  [address: string]: {
    ensName?: string;
    avatar?: string;
    lastUpdate: number;
  };
};

// Refresh every 10 minutes
const ENS_TIMEOUT = 10 * 60 * 1000;

let ensAddressesTimerId = -1;

export const ensAddresses: Readable<ENSAddresses | null> = derived(
  [provider, leaderboard],
  ([$provider, $leaderboard], set) => {
    window.clearInterval(ensAddressesTimerId);
    if ($provider && $leaderboard) {
      const update = retryWrap(async () => {
        console.log("Task: update ens addresses");
        const key = "ensAddresses";
        const a = db.getsert(key, {} as ENSAddresses);
        set(a);
        for (let i = 0; i < $leaderboard.length; i++) {
          const { address } = $leaderboard[i];

          if (!a[address]) {
            a[address] = {
              lastUpdate: 0,
            };
          }

          if (Date.now() - a[address].lastUpdate > ENS_TIMEOUT) {
            try {
              const ensName = await $provider.lookupAddress(address);
              if (ensName) {
                a[address].ensName = ensName;
                a[address].lastUpdate = Date.now();
                db.set(key, a);
                set(a);
              }
              const avatar = await $provider.getAvatar(address);
              if (avatar) {
                a[address].avatar = avatar;
                a[address].lastUpdate = Date.now();
                db.set(key, a);
                set(a);
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      });
      ensAddressesTimerId = window.setInterval(update, 60 * 1000);
      update();
      return () => window.clearInterval(ensAddressesTimerId);
    } else {
      set(null);
    }
  }
);
