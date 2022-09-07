import { ethers, Wallet } from "ethers";
import { derived, readable } from "svelte/store";
import { ethereumEndpoint } from "./config";
import { writableLocalStorage } from "./x";

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
