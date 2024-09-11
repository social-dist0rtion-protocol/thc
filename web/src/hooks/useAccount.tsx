import { useAccount as useWagmiAccount } from "wagmi";
import { useBurnerWallet } from "./useBurnerWallet";

export function useAccount() {
  const { burnerWallet } = useBurnerWallet();
  const account = useWagmiAccount();

  return account.isConnected ? account : burnerWallet;
}
