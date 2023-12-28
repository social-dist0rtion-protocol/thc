import { BigNumber, ethers, Wallet } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { derived, readable, writable, type Readable } from "svelte/store";
import { ethereumEndpoint } from "./config";
import { writableLocalStorage } from "./x";
import { retryWrap } from "./x/retry";
import "./registerWordlists";

export const provider = readable(
  new ethers.providers.StaticJsonRpcProvider(ethereumEndpoint)
);

export const mnemonic = writableLocalStorage(
  "mnemonic",
  () => Wallet.createRandom().mnemonic.phrase
);

export const signer: Readable<Wallet | null> = derived(
  [provider, mnemonic],
  ([$provider, $mnemonic], set) => {
    if ($provider && $mnemonic) {
      const start = Date.now();
      try {
        set(ethers.Wallet.fromMnemonic($mnemonic).connect($provider));
      } catch (e: any) {
        mnemonic.set(null);
        window.location.reload();
      }
      console.log(Date.now() - start);
    } else {
      set(null);
    }
  }
);

export const address = derived(signer, ($signer) =>
  $signer ? $signer.address : null
);

export const reloadBalanceTrigger = writable(60000);

export const balance: Readable<BigNumber | null> = derived(
  [signer, reloadBalanceTrigger],
  ([$signer], set) => {
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
