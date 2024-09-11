import { defineConfig } from "@wagmi/cli";
import { HardhatConfig, hardhat } from "@wagmi/cli/plugins";
import { react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    hardhat({
      project: "../eth",
      deployments: {
        TreasureHuntCreator: {
          1337: "0x0Bfe50C37E70cc6a8a47c16B5Fe5bcAbDF99aB71",
          10: "0xa602e08C4Ef757Ed98C15527E417249bAc98CB20",
        },
      },
    }),
    react(),
  ],
});
