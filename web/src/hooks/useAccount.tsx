import { useSendTransaction, useAccount as useWagmiAccount } from "wagmi";
import { useBurnerWallet } from "./useBurnerWallet";
import { HDAccount } from "viem";

export function useAccount() {
  const { burnerWallet } = useBurnerWallet();
  const account = useWagmiAccount();

  return account.isConnected ? account : burnerWallet;
}
