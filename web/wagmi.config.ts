import { defineConfig } from "@wagmi/cli";
import { HardhatConfig, hardhat } from "@wagmi/cli/plugins";
import { react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    hardhat({
      project: "../evm",
      deployments: {
        Propcorn: {
          1337: "0xf6018dffAc9B1C63e8f1097148664551CEaEc5A2",
          10: "0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6",
        },
      },
    }),
    react(),
  ],
});
