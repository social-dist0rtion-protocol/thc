import { readable, derived } from "svelte/store";
import ethers from "ethers";
import db from "./db";
import THC from "./contracts/THC.json";
import base58Encode from "base58-encode";
import CryptoJS from "crypto-js";

window.ethers = ethers;

const Wallet = ethers.Wallet;
const CURRENT_WALLET = { seed: undefined, wallet: undefined };

export const network = db.writable("network", "http://localhost:8545");
export const mnemonic = db.writable(
  "mnemonic",
  () => Wallet.createRandom().mnemonic
);

export const current = db.writable("current", { solution: undefined });

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

export const chainId = derived(provider, ($provider, set) => {
  $provider.getNetwork().then(({ chainId }) => set(chainId));
});

export const wallet = derived(
  [provider, walletNoProvider],
  ([$provider, $walletNoProvider]) => $walletNoProvider.connect($provider)
);

export const thc = derived([wallet, chainId], ([$wallet, $chainId], set) => {
  console.log($chainId);
  if ($chainId) {
    set(new ethers.Contract(THC.networks[$chainId].address, THC.abi, $wallet));
  }
});


export const currentQuest = derived(
  [thc, current],
  async ([$thc, $current], set) => {
    if ($thc) {
      const solution = $current.solution;
      const hashAddress = await $thc.functions.currentQuest();
      const completeHashAddress = hashAddress.replace("0x", "0x1220");
      const hashBuffer = ethers.utils.arrayify(completeHashAddress);
      const ipfsHash = base58Encode(hashBuffer);
      const ipfsUrl = "https://ipfs.io/ipfs/" + ipfsHash;
      const response = await fetch(ipfsUrl);
      const encryptedQuest = await response.text();

      if (solution !== undefined) {
        const bytes = CryptoJS.AES.decrypt(encryptedQuest, solution);
        const plainQuest = bytes.toString(CryptoJS.enc.Utf8);
        set(plainQuest);
      } else {
        set(encryptedQuest); // Which is not actually encrypted
      }
    }
  }
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
