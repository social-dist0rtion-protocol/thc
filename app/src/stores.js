import { readable, derived } from "svelte/store";
import ethers from "ethers";
import db from "./db";

window.ethers = ethers;

const Wallet = ethers.Wallet;
const CURRENT_WALLET = { seed: undefined, wallet: undefined };

export const network = db.writable("network", "http://localhost:8545");
export const mnemonic = db.writable(
  "mnemonic",
  () => Wallet.createRandom().mnemonic
);

export const walletNoProvider = derived(mnemonic, $mnemonic => {
  // Wallet.fromMnemonic takes some time to create the wallet, so we cache it.
  if (CURRENT_WALLET.mnemonic !== $mnemonic) {
    CURRENT_WALLET.mnemonic = $mnemonic;
    CURRENT_WALLET.wallet = Wallet.fromMnemonic($mnemonic);
  }
  return CURRENT_WALLET.wallet;
});

export const provider = derived(
  network,
  $network => new ethers.providers.JsonRpcProvider($network)
  //ethers.getDefaultProvider($network)
);

export const chainId = derived(provider, ($provider, set) =>
  $provider.getNetwork().then(({ chainId }) => set(chainId))
);

export const wallet = derived(
  [provider, walletNoProvider],
  ([$provider, $walletNoProvider]) => $walletNoProvider.connect($provider)
);

export const balance = derived(
  [provider, walletNoProvider],
  ([$provider, $walletNoProvider], set) => {
    const updateBalance = balance => set(balance);
    $provider.on($walletNoProvider.address, updateBalance);
    return () =>
      $provider.removeListener($walletNoProvider.address, updateBalance);
  }
);
