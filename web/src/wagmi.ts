import { http, createConfig } from "wagmi";
import { /* localhost, mainnet, */ optimism } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { RPC_NODE_URL, WALLET_CONNECT_PROJECT_ID } from "./env";

export const config = createConfig({
  chains: [optimism],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
    }),
  ],
  transports: {
    [optimism.id]: http(RPC_NODE_URL),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
