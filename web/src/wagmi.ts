import { http, createConfig } from "wagmi";
import { /* localhost, mainnet, */ sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { RPC_NODE_URL, WALLET_CONNECT_PROJECT_ID } from "./env";

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
    }),
  ],
  transports: {
    [sepolia.id]: http(RPC_NODE_URL),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
