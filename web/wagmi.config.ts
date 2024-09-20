import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";
import { react } from "@wagmi/cli/plugins";
import { Hex } from "viem";
import thc from "./thc.json";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    hardhat({
      project: "../eth",
      deployments: {
        TreasureHuntCreator: {
          [thc.chainId]: thc.thcAddress as Hex,
        },
      },
    }),
    react(),
  ],
});
