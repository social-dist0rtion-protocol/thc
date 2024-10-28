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
    const { wallet, client, thcAddress, chainId } = await load(basePath);
    const rootHash = await readRootHash(basePath);

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
  .command("leaderboard <basePath>")
  .description("Show leaderboard")
  .action(async (basePath: string) => {
    const { client, thcAddress } = await load(basePath);
    const leaderboard = await getLeaderboard(client, thcAddress);
    console.log(leaderboard);
  });

program
  .command("provide-dapp <basePath> <dappPath>")
  .description("Copy game artifacts to the dapp")
  .action(async (basePath: string, dappPath: string) => {
    const { cname, CONFIG_PATH } = await load(basePath);

    // Copy CNAME to public
    console.log(path.join(dappPath, "public", "CNAME"));
    await writeFile(path.join(dappPath, "public", "CNAME"), cname);

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
