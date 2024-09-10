#!/usr/bin/env node

import "dotenv/config";
import { Command } from "commander";
import { mkdir, readFile } from "fs/promises";
import { main } from "./utils";
import { getWallet, getPublicClient, setRootHash } from "./evm";
import { Config, isHexString } from "./types";
import path from "path";

const program = new Command();

program.name("thc").description("Treasure Hunt CLI!").version("0.0.1");

const CONFIG_PATH = "config.json";
const ARTIFACTS_PATH = "artifacts";
const CHAPTERS_PATH = path.join(ARTIFACTS_PATH, "chapters");
const METADATA_PATH = path.join(ARTIFACTS_PATH, "metadata.json");
const ROOT_HASH_PATH = path.join(ARTIFACTS_PATH, "root-hash");

program
  .command("build <basePath>")
  .description("Build THC artifacts")
  .action(async (basePath: string) => {
    await main(
      path.join(basePath, "chapters"),
      CHAPTERS_PATH,
      METADATA_PATH,
      ROOT_HASH_PATH
    );
  });

program
  .command("set-root-hash")
  .description("Update root hash")
  .action(async () => {
    const endpoint = process.env.ETHEREUM_ENDPOINT;
    const privateKey = process.env.PRIVATE_KEY;
    const { chainId, thcAddress } = JSON.parse(
      await readFile(CONFIG_PATH, "utf8")
    ) as Config;
    const rootHash = await readFile(ROOT_HASH_PATH);

    if (!endpoint) {
      console.error("Cannot find 'endpoint' in env");
      process.exit(1);
    }

    if (!isHexString(privateKey)) {
      console.error("Cannot find 'privateKey' in env");
      process.exit(1);
    }

    if (!chainId) {
      console.error("Cannot find 'chainId' in config");
      process.exit(1);
    }

    if (!isHexString(thcAddress)) {
      console.error("Cannot find 'thcAddress' in config");
      process.exit(1);
    }

    if (!isHexString(rootHash)) {
      console.error("Cannot find 'thcAddress' in config");
      process.exit(1);
    }

    const wallet = getWallet(privateKey, chainId, endpoint);
    const client = getPublicClient(chainId, endpoint);
    console.log("Wallet address", await wallet.getAddresses());

    const txHash = await setRootHash(wallet, thcAddress, rootHash);
    console.log("Tx hash", txHash);

    const receipt = await client.waitForTransactionReceipt({ hash: txHash });
    console.log("Tx included in block", receipt.blockNumber.toString());
  });

async function run() {
  await mkdir(ARTIFACTS_PATH, {
    recursive: true,
  });
  program.parse(process.argv);
}

run();
