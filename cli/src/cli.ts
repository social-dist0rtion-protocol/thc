#!/usr/bin/env node

import dotenv from "dotenv";
import { Command } from "commander";
import { copyFile, cp, mkdir, readFile } from "fs/promises";
import { main } from "./utils";
import { getWallet, getPublicClient, setRootHash } from "./evm";
import { Config, isHexString } from "./types";
import path from "path";
import packageJson from "../package.json";
import {
  getChaptersPath,
  getMetadataPath,
  getRootHashPath,
  readRootHash,
} from "./lib";
import { getArtifactsPath } from "../../lib/src/fsUtils";

const program = new Command();

program
  .name("thc")
  .description(packageJson.description)
  .version(packageJson.version);

const CONFIG_PATH = "thc.json";

program
  .command("build <basePath>")
  .description("Build THC artifacts")
  .action(async (basePath: string) => {
    await mkdir(getArtifactsPath(basePath), {
      recursive: true,
    });

    await main(
      path.join(basePath, "chapters"),
      getChaptersPath(basePath),
      getMetadataPath(basePath),
      getRootHashPath(basePath)
    );
  });

program
  .command("set-root-hash <basePath>")
  .description("Update root hash")
  .action(async (basePath: string) => {
    dotenv.config({ path: path.join(basePath, ".env") });
    const endpoint = process.env.ETHEREUM_ENDPOINT;
    const privateKey = process.env.PRIVATE_KEY;
    const { chainId, thcAddress } = JSON.parse(
      await readFile(path.join(basePath, CONFIG_PATH), "utf8")
    ) as Config;

    const rootHash = await readRootHash(basePath);

    if (!endpoint) {
      console.error("Cannot find 'endpoint' in env");
      process.exit(1);
    }

    if (!privateKey) {
      console.error("Cannot find 'privateKey' in env");
      process.exit(1);
    }

    if (!isHexString(privateKey)) {
      console.error("'privateKey' should start with '0x'");
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
    console.log("Root hash", rootHash);

    const txHash = await setRootHash(wallet, thcAddress, rootHash);
    console.log("Tx hash", txHash);

    const receipt = await client.waitForTransactionReceipt({ hash: txHash });
    console.log("Tx included in block", receipt.blockNumber.toString());
  });

program
  .command("provide-dapp <basePath> <dappPath>")
  .description("Copy game artifacts to the dapp")
  .action(async (basePath: string, dappPath: string) => {
    dotenv.config({ path: path.join(basePath, ".env") });
    const endpoint = process.env.ETHEREUM_ENDPOINT;
    const { chainId, thcAddress } = JSON.parse(
      await readFile(path.join(basePath, CONFIG_PATH), "utf8")
    ) as Config;

    const rootHash = await readRootHash(basePath);

    if (!endpoint) {
      console.error("Cannot find 'endpoint' in env");
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

    // Copy config.json to the dapp. The file contains info about the game.
    await cp(path.join(basePath, CONFIG_PATH), path.join(dappPath, "thc.json"));

    // Copy metadata.json to the dapp. It contains all solution addresses
    await cp(
      getMetadataPath(basePath),
      path.join(dappPath, "src", "metadata.json")
    );

    // Copy the encrypted chapters to the dapp
    await cp(
      getChaptersPath(basePath),
      path.join(dappPath, "public", "game-data"),
      { recursive: true }
    );
  });

program.parse(process.argv);
