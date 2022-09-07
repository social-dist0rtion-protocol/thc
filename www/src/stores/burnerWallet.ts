import { BigNumber, ethers, Wallet } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { derived, readable, type Readable } from "svelte/store";
import { ethereumEndpoint } from "./config";
import { writableLocalStorage } from "./x";
import { retry, retryWrap } from "./x/retry";

export const provider = readable(
  new ethers.providers.JsonRpcProvider(ethereumEndpoint)
);

export const mnemonic = writableLocalStorage(
  "mnemonic",
  () => Wallet.createRandom().mnemonic.phrase
);

export const signer = derived(
  [provider, mnemonic],
  ([$provider, $mnemonic]) => {
    if ($provider && $mnemonic) {
      const wallet = ethers.Wallet.fromMnemonic($mnemonic).connect($provider);
      return wallet;
    }
    return null;
  }
);

export const address = derived(signer, ($signer) =>
  $signer ? $signer.address : null
);

export const balance: Readable<BigNumber | null> = derived(
  signer,
  ($signer, set) => {
    if ($signer) {
      const update = retryWrap(async () => {
        const balance = await $signer.getBalance();
        set(balance);
      });
      const timerId = window.setInterval(update, 60000);
      update();
      return () => window.clearInterval(timerId);
    } else {
      set(null);
    }
  }
);

export const lowBalance = derived(balance, ($balance) =>
  $balance ? $balance.lt(parseEther("0.01")) : false
);