import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import replace from "@rollup/plugin-replace";
import { createHtmlPlugin } from "vite-plugin-html";
import { readFileSync } from "fs";

type ContractsAddresses = {
  [key: string]: string;
};

type Networks = {
  [key: string]: ContractsAddresses;
};

function getAddresses(chainId: string, dirs: string[]) {
  let networks = {} as Networks;
  for (let dir of dirs) {
    networks = {
      ...JSON.parse(readFileSync(dir, "utf8")),
    };
  }
  if (!networks[chainId]) {
    throw new Error(`Cannot find contracts for chainId ${chainId}`);
  }
  return networks[chainId];
}

// https://vitejs.dev/config/
export default async ({ mode }) => {
  //process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const env = loadEnv(mode, process.cwd(), [
    "VITE_",
    "HTML_",
    "SMART_CONTRACT_",
    "CHAPTERS",
  ]);

  const smartContractPath = env?.SMART_CONTRACT_PATH;
  if (!smartContractPath) {
    console.error("Cannot find smart contract directory");
    process.exit(1);
  }

  const chaptersPath = env?.CHAPTERS_PATH;
  if (!chaptersPath) {
    console.error("Cannot find chapters path");
    process.exit(1);
  }
  const chapters = readFileSync(chaptersPath, "utf8");

  const chainId = env.VITE_ETHEREUM_CHAIN_ID;
  const contractsAddresses = getAddresses(
    chainId,
    smartContractPath.split(";")
  );

  return defineConfig({
    base: "./",
    plugins: [
      svelte(),
      replace({
        __VITE_CONTRACTS_ADDRESSES__: JSON.stringify(contractsAddresses),
        __VITE_CHAPTERS__: chapters,
      }),
      createHtmlPlugin({
        inject: {
          data: {
            ...env,
          },
        },
      }),
    ],
  });
};
