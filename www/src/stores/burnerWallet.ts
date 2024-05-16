import {
  HDNodeWallet,
  JsonRpcProvider,
  Mnemonic,
  Wallet,
  type Signer,
} from "ethers";
import { derived, readable, writable, type Readable } from "svelte/store";
import { ethereumEndpoint } from "./config";
import { writableLocalStorage } from "./x";
import { retryWrap } from "./x/retry";
import "./registerWordlists";

export const provider = readable(new JsonRpcProvider(ethereumEndpoint));
window.Wallet = Wallet;

export const privateKey = writable<string | undefined>();

export const mnemonic = writableLocalStorage(
  "mnemonic",
  () => Wallet.createRandom().mnemonic?.phrase
);

export const signer: Readable<Signer | undefined> = derived(
  [provider, mnemonic],
  ([$provider, $mnemonic], set) => {
    if ($provider && $mnemonic) {
      const start = Date.now();
      try {
        const hdWallet = HDNodeWallet.fromMnemonic(
          Mnemonic.fromPhrase($mnemonic)
        );
        const s = new Wallet(hdWallet.privateKey, $provider);
        set(s);
      } catch (e: any) {
        console.log(e);
        //mnemonic.set(undefined);
        //window.location.reload();
      }
      console.log(Date.now() - start);
    } else {
      set(undefined);
    }
  }
);

/*
export const address = derived(signer, ($signer) =>
  $signer ? $signer.getAddress(): null
);

export const reloadBalanceTrigger = writable(60000);

export const balance: Readable<BigInt| null> = derived(
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

*/
