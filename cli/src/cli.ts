#!/usr/bin/env node
import { Command } from "commander";
import { cp, mkdir, writeFile } from "fs/promises";
import { load, main } from "./utils";
import { setRootHash, getLeaderboard } from "./evm";
import { isHexString } from "./types";
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

program
  .command("build <cbd>")
  .description("Build THC artifacts")
  .action(async (cbd: string) => {
    await mkdir(getArtifactsPath(cbd), {
      recursive: true,
    });

    await main(
      path.join(cbd, "chapters"),
      getChaptersPath(cbd),
      getMetadataPath(cbd),
      getRootHashPath(cbd)
    );
  });

program
  .command("set-root-hash <cbd>")
  .description("Update root hash")
  .action(async (cbd: string) => {
    const { wallet, client, thcAddress, chainId } = await load(cbd);
    const rootHash = await readRootHash(cbd);

    if (!isHexString(rootHash)) {
      console.error("Cannot find 'thcAddress' in config");
      process.exit(1);
    }

    console.log("Wallet address", await wallet.getAddresses());
    console.log("Root hash", rootHash);

    const txHash = await setRootHash(wallet, thcAddress, rootHash);
    console.log("Tx hash", txHash);

    const receipt = await client.waitForTransactionReceipt({ hash: txHash });
    console.log("Tx included in block", receipt.blockNumber.toString());
  });

program
  .command("leaderboard <cbd>")
  .description("Show leaderboard")
  .action(async (cbd: string) => {
    const { client, thcAddress, metadata } = await load(cbd);
    const leaderboard = await getLeaderboard(
      client,
      thcAddress,
      metadata.keys.length,
      metadata.keys.map((x) => x.emoji)
    );
    console.log(leaderboard);
  });

program
  .command("provide-dapp <cbd> <dappPath>")
  .description("Copy game artifacts to the dapp")
  .action(async (cbd: string, dappPath: string) => {
    const { cname, CONFIG_PATH } = await load(cbd);

    // Copy CNAME to public
    await writeFile(path.join(dappPath, "public", "CNAME"), cname);

    // Copy config.json to the dapp. The file contains info about the game.
    await cp(path.join(cbd, CONFIG_PATH), path.join(dappPath, "thc.json"));

    // Copy metadata.json to the dapp. It contains all solution addresses
    await cp(getMetadataPath(cbd), path.join(dappPath, "src", "metadata.json"));

    // Copy the encrypted chapters to the dapp
    await cp(getChaptersPath(cbd), path.join(dappPath, "public", "game-data"), {
      recursive: true,
    });
  });

program.parse(process.argv);
