#!/usr/bin/env node
import { Command } from "commander";
import { cp, mkdir, writeFile } from "fs/promises";
import { load, main } from "./utils";
import { setRootHash, getLeaderboard, getRootHash } from "./evm";
import { isHexString } from "./types";
import { formatDistanceToNow } from "date-fns";
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
    const { wallet, client, thcAddress } = await load(cbd);
    const rootHash = await readRootHash(cbd);

    if (!isHexString(rootHash)) {
      console.error("Cannot find 'thcAddress' in config");
      process.exit(1);
    }

    const oldRootHash = await getRootHash(client, thcAddress);

    console.log("Wallet address", await wallet.getAddresses());
    console.log("Old root hash", oldRootHash);
    console.log("New root hash", rootHash);

    if (rootHash !== oldRootHash) {
      const txHash = await setRootHash(wallet, thcAddress, rootHash);
      console.log("Tx hash", txHash);

      const receipt = await client.waitForTransactionReceipt({ hash: txHash });
      console.log("Tx included in block", receipt.blockNumber.toString());
    } else {
      console.log("Root hash is already up-to-date");
    }
  });

program
  .command("get-root-hash <cbd>")
  .description("Retrieve the root hash from the smart contract")
  .action(async (cbd: string) => {
    const { client, thcAddress } = await load(cbd);
    const rootHash = await getRootHash(client, thcAddress);
    const localRootHash = await readRootHash(cbd);

    console.log("Contract root hash:", rootHash);
    console.log("Local root hash:   ", localRootHash);
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

    const now = Math.round(Date.now() / 1000);

    for (const { account, timestamp, chapter, keys } of leaderboard) {
      const emojis = keys.map((k) => (k === null ? "x" : k));
      const diff = formatDistanceToNow(new Date(timestamp * 1000), {
        addSuffix: true,
      });
      console.log(
        `${account}: chapter ${chapter}.`,
        `Last submission ${diff}.`,
        `Keys collected: ${emojis.join(", ")}`
      );
    }
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
