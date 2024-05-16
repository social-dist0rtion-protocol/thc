import { keccak256, toUtf8Bytes } from "ethers/lib/utils";
import {
  derived,
  get,
  writable,
  type Readable,
  type Writable,
} from "svelte/store";
import { TreasureHuntCreator__factory } from "../../../eth/typechain";
import { provider, signer } from "./burnerWallet";
import { contractsAddresses } from "./config";
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

const thcAddressLower = contractsAddresses["TreasureHuntCreator"].toLowerCase();

// Chapter should be a number, but we store it as JSON so it's easier to cast it
// to string
export type Game = { [chapter: string]: Chapter };

export const game = writableLocalStorage(`${thcAddressLower}:game`, {} as Game);

export const lastTransactionMined: Writable<null | string> =
  writableLocalStorage(`${thcAddressLower}:lastTransactionMined`, null);

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
        console.log("Update quests root CID", cid);
        set(cid);
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

export const totalKeys: Readable<null | number> = derived(
  thc,
  ($thc, set: (v: number | null) => void) => {
    if ($thc) {
      retry(async () => {
        set(await $thc.totalKeys());
      }, true);
    }
  },
  null
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
        const contentUrl = `/game-data/${$questsRootCID}/${$currentChapter}`;
        let quest: string;
        try {
          const response = await fetch(contentUrl);
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

let leaderboardTimerId = -1;

export const leaderboard: Readable<Awaited<
  ReturnType<typeof parseLeaderboard>
> | null> = derived([thc, totalKeys], ([$thc, $totalKeys], set) => {
  window.clearInterval(leaderboardTimerId);
  if ($thc && $totalKeys !== null) {
    const update = retryWrap(async () => {
      set(await parseLeaderboard($thc, $totalKeys));
    });
    // Reload every minute
    leaderboardTimerId = window.setInterval(update, 60000);
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

// Refresh every hour
const ENS_TIMEOUT = 60 * 60 * 1000;

let ensAddressesTimerId = -1;

export const ensAddressesRefreshTs = writable(Date.now());

export function ensAddressesRefresh() {
  db.set(
    "ensAddresses",
    (v: ENSAddresses | null) => {
      if (v === null) {
        return {};
      }
      for (let address in v) {
        v[address].lastUpdate = 0;
      }
      return v;
    },
    {}
  );
  ensAddressesRefreshTs.set(Date.now());
}

export const ensAddresses: Readable<ENSAddresses | null> = derived(
  [provider, leaderboard, ensAddressesRefreshTs],
  ([$provider, $leaderboard], set) => {
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
            console.log("lookup ENS for address", address);
            try {
              const ensName = await $provider.lookupAddress(address);
              if (ensName) {
                a[address].ensName = ensName;
                a[address].lastUpdate = Date.now();
                db.set(key, a);
                set(a);
                const avatar = await $provider.getAvatar(address);
                if (avatar) {
                  if (avatar.startsWith("ipfs://")) {
                    a[
                      address
                    ].avatar = `https://gateway.pinata.cloud/ipfs/${avatar.replace(
                      "ipfs://",
                      ""
                    )}`;
                  } else if (avatar.startsWith("bzz://")) {
                    a[address].avatar = `https://bzz.link/bzz/${avatar.replace(
                      "bzz://",
                      ""
                    )}/`;
                  } else {
                    a[address].avatar = avatar;
                  }
                  a[address].lastUpdate = Date.now();
                  db.set(key, a);
                  set(a);
                }
              }
            } catch (e) {
              console.error(e);
            }
          }
          a[address].lastUpdate = Date.now();
          db.set(key, a);
        }
      });
      update();
    } else {
      set({});
    }
  }
);
