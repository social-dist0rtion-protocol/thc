import { http, createConfig } from "wagmi";
import { /* localhost, mainnet, */ optimism } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [optimism],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [optimism.id]: http(
      "https://opt-mainnet.g.alchemy.com/v2/" +
        import.meta.env.VITE_ALCHEMY_API_KEY
    ),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
