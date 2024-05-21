import {
  BrowserProvider,
  HDNodeWallet,
  JsonRpcProvider,
  Mnemonic,
  Wallet,
  type Provider,
  type Signer,
} from "ethers";
import { derived, readable, writable, type Readable } from "svelte/store";
import { ethereumEndpoint } from "./config";
import { writableLocalStorage } from "./x";
import { retryWrap } from "./x/retry";
import "./registerWordlists";
//import { modal } from "./web3Modal";

export const privateKey = writable<string | undefined>();

export const mnemonic = writableLocalStorage(
  "mnemonic",
  () => Wallet.createRandom().mnemonic?.phrase
);

const useNativeWallet = writable(false);

export const provider = writable<Provider>(
  new JsonRpcProvider(ethereumEndpoint)
);

export const signer: Readable<Signer | undefined> = derived(
  [provider, mnemonic, useNativeWallet],
  ([$provider, $mnemonic, $useNativeWallet], set) => {
    if ($useNativeWallet) {
      /*
      const walletProvider = modal.getWalletProvider();
      if (!walletProvider) {
        console.log("No wallet provider");
        return;
      }
      const ethersProvider = new BrowserProvider(walletProvider);
      ethersProvider.getSigner().then(set);
      */
    } else if ($provider && $mnemonic) {
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
    } else {
      set(undefined);
    }
  }
);

/*
modal.subscribeProvider(
  ({
    provider: newProvider,
    providerType,
    address,
    error,
    chainId,
    isConnected,
  }) => {
    console.log(
      "change",
      newProvider,
      providerType,
      address,
      error,
      chainId,
      isConnected
    );
    if (newProvider !== undefined) {
      useNativeWallet.set(isConnected);
      const walletProvider = modal.getWalletProvider();
      if (!walletProvider) {
        console.log("No wallet provider");
        return;
      }
      const ethersProvider = new BrowserProvider(walletProvider);
      provider.set(ethersProvider);
    }
  }
);
*/

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
