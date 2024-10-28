// import { useAccount as useWagmiAccount } from "wagmi";
import { useBurnerWallet } from "./useBurnerWallet";
import { mnemonicToSeedSync } from "@scure/bip39";
import { HDKey } from "@scure/bip32";
// import { signMessage, signTransaction } from "viem/accounts";

type UnifiedSigner = {
  address: string;
  signMessage: (message: string) => Promise<string>;
  signTransaction: (tx: object) => Promise<string>;
};

export function useAccount(): UnifiedSigner | undefined {
  const { burnerWallet, mnemonic } = useBurnerWallet(); // Your custom HDAccount
  const seed = mnemonicToSeedSync(mnemonic);
  const { privateKey } = HDKey.fromMasterSeed(seed);
  /*const { data: wagmiSigner } = useSigner(); // Wagmi's signer
  const account = useWagmiAccount();

  // If Wagmi account is connected, return Wagmi's signer with unified methods
  if (isConnected && wagmiSigner && address) {
    return {
      address,
      signMessage: (message: string) => wagmiSigner.signMessage(message),
      signTransaction: (tx: object) => wagmiSigner.signTransaction(tx),
    };
  }

  // If Viem burner wallet is available, wrap its methods
  if (burnerWallet) {
    return {
      address: burnerWallet.address,
      signMessage: async (message: string) =>
        signMessage({ message: message, privateKey: privateKey }),
      signTransaction: async (tx: object) =>
        signTransaction({ privateKey: privateKey, transaction: tx }),
    };
  }*/

  return undefined;
}
