import {
  Mnemonic,
  Signature,
  Wallet,
  getBytes,
  keccak256,
  toUtf8Bytes,
  wordlists,
  type Signer,
} from "ethers";
import type { TreasureHuntCreator } from "../../eth/typechain";
import { writable } from "svelte/store";
import {
  GelatoRelay,
  type CallWithSyncFeeERC2771Request,
} from "@gelatonetwork/relay-sdk";
import { contractsAddresses, ethereumChainId } from "./stores/config";
import metadata from "./metadata.json";

export async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function shortAddress(a: string) {
  return a.substring(0, 6) + "…" + a.substring(16, 20);
}

export async function addressFromSolution(solution: string) {
  solution = solution.toLowerCase();
  const hash = keccak256(toUtf8Bytes(solution));
  const solutionWallet = new Wallet(hash);
  return solutionWallet.address;
}

export async function signatureFromSolution(address: string, solution: string) {
  solution = solution.toLowerCase();
  const hash = keccak256(toUtf8Bytes(solution));
  const solutionWallet = new Wallet(hash);
  const signature = await solutionWallet.signMessage(getBytes(address));
  return Signature.from(signature);
}

export async function parseLeaderboard(
  thc: TreasureHuntCreator,
  totalKeys: number
) {
  function parse(value: bigint) {
    const address = "0x" + (value >> 96n).toString(16).padStart(40, "0");
    const keysBitmap = (value >> 8n) & ((1n << 80n) - 1n);
    const keys = [];

    for (let i = 0; i < totalKeys; i++) {
      if ((keysBitmap & (1n << BigInt(i))) > 0n) {
        keys.push(metadata.keys[i].emoji);
      } else {
        keys.push("?");
      }
    }

    const chapter = Number(value & 0xffn);

    return { address, chapter, keys };
  }

  async function getLeaderboard() {
    const leaderboard = [];
    let page = 0;
    while (true) {
      const items = await thc.getLeaderboard(page);
      for (let entry of items) {
        if (entry === 0n) {
          return leaderboard;
        } else {
          leaderboard.push(parse(entry));
        }
      }
      page++;
    }
  }

  const leaderboard = await getLeaderboard();
  leaderboard.sort(
    (a, b) =>
      b.chapter - a.chapter ||
      b.keys.filter((x) => x).length - a.keys.filter((x) => x).length
  );
  return leaderboard;
}

export function getCorrespondingWordlist(mnemonic: string) {
  for (let locale in wordlists) {
    const wordlist = wordlists[locale];
    if (Mnemonic.isValidMnemonic(mnemonic, wordlist)) {
      return wordlists[locale];
    }
  }
}

function _prepareSubmitSolutionOrKey(
  thc: TreasureHuntCreator,
  signer: Signer,
  onSuccess: ({
    txHash,
    solution,
  }: {
    txHash: string;
    solution: string;
  }) => void,
  isSolution: boolean
) {
  const status = writable<
    "PENDING" | "SUCCESS" | "ERROR" | "WRONG" | undefined
  >();
  const error = writable<string | undefined>();
  const txHash = writable<string | undefined>();

  async function relayCall(solution: string) {
    status.set("PENDING");
    const address = await signer.getAddress();

    const { r, s, v } = await signatureFromSolution(address, solution);

    let data;
    if (isSolution) {
      ({ data } = await thc.submit.populateTransaction(v, r, s));
    } else {
      ({ data } = await thc.submitKey.populateTransaction(v, r, s));
    }

    const relay = new GelatoRelay();
    const request: CallWithSyncFeeERC2771Request = {
      chainId: BigInt(ethereumChainId),
      target: contractsAddresses["TreasureHuntCreator"],
      data: data!,
      user: address,
      feeToken: "0x4200000000000000000000000000000000000006",
      isRelayContext: true,
    };

    const relayResponse = await relay.callWithSyncFeeERC2771(request, signer);

    while (true) {
      console.log("Polling task", relayResponse.taskId);
      const taskStatus = await relay.getTaskStatus(relayResponse.taskId);
      console.log(taskStatus);
      if (taskStatus) {
        const { taskState } = taskStatus;
        if (
          ["CheckPending", "ExecPending", "WaitingForConfirmation"].includes(
            taskState
          )
        ) {
          status.set("PENDING");
          error.set(undefined);
        } else if (
          ["ExecSuccess"].includes(taskState) &&
          taskStatus.transactionHash
        ) {
          txHash.set(taskStatus.transactionHash);
          status.set("SUCCESS");
          error.set(undefined);
          return { txHash: taskStatus.transactionHash, solution };
        } else if (["ExecReverted", "Cancelled"].includes(taskState)) {
          txHash.set(undefined);
          status.set("ERROR");
          error.set(taskStatus.lastCheckMessage);
          return {};
        }
      }
      await sleep(1000);
    }

    /*
    console.log(tx);
    state = "MINING";
    const receipt = await tx.wait();
    console.log("Transaction Mined: " + receipt);
    console.log(receipt);
    state = "SUCCESS";
    $lastTransactionMined = tx.hash;
    $game[chapterNumber.toString()].transactionHash = tx.hash;
    */
  }

  async function walletCall(solution: string) {
    status.set("PENDING");
    const address = await signer.getAddress();
    const { r, s, v } = await signatureFromSolution(address, solution);
    const tx = await thc.submit(v, r, s);
    console.log(tx);
    const receipt = await tx.wait();
    console.log("Transaction Mined: " + receipt);
    console.log(receipt);
    status.set("SUCCESS");
    txHash.set(tx.hash);
  }

  async function submit(solution: string) {
    console.log("submit", solution);
    reset();
    try {
      const r = await relayCall(solution);
      if (r && r.txHash) {
        onSuccess({ txHash: r.txHash, solution });
        return true;
      }
    } catch (e) {
      const msg = (e as any).toString() as string;
      if (msg.toLowerCase().includes("wrong solution")) {
        status.set("WRONG");
      } else {
        console.log("error submitting solution", e);
        status.set("ERROR");
        error.set(msg);
      }
    }
    return false;
  }

  function reset() {
    status.set(undefined);
    error.set(undefined);
    txHash.set(undefined);
  }

  return {
    submit,
    status,
    error,
    txHash,
    reset,
  };
}

export function prepareSubmitSolution(
  thc: TreasureHuntCreator,
  signer: Signer,
  onSuccess: ({
    txHash,
    solution,
  }: {
    txHash: string;
    solution: string;
  }) => void
) {
  return _prepareSubmitSolutionOrKey(thc, signer, onSuccess, true);
}

export function prepareSubmitKey(
  thc: TreasureHuntCreator,
  signer: Signer,
  onSuccess: ({
    txHash,
    solution,
  }: {
    txHash: string;
    solution: string;
  }) => void
) {
  return _prepareSubmitSolutionOrKey(thc, signer, onSuccess, false);
}

export function addressToChapterIndex(address: string) {
  let i = 0;
  address = address.toLowerCase();
  for (; i < metadata.chapters.length; i++) {
    if (address === metadata.chapters[i].toLowerCase()) {
      return i;
    }
  }
  return -1;
}

export function addressToKeyIndex(address: string) {
  let i = 0;
  address = address.toLowerCase();
  for (; i < metadata.keys.length; i++) {
    if (address === metadata.keys[i].address.toLowerCase()) {
      return i;
    }
  }
  return -1;
}
