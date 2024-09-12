import { task } from "hardhat/config";
import { TreasureHuntCreator } from "../typechain";
import { CID } from "multiformats";
import { loadChapters, loadContract } from "./utils";

task("root-set", "Set root CID")
  .addPositionalParam("cid", "The file with all chapters")
  .setAction(async ({ cid }: { cid: string }, hre) => {
    throw "not implemented";
    const thcContract = (await loadContract(
      hre,
      "TreasureHuntCreator"
    )) as TreasureHuntCreator;
    console.log(
      `Setting root CID ${cid} for contract ${thcContract.getAddress()}`
    );
    const cidBytes = CID.parse(cid).bytes;
    const tx = await thcContract.setup(cidBytes);

    console.log(`  Transaction submitted. Waiting for 3 confirmation....`);
    const receipt = await tx.wait(3);
    console.log(`  Root CID successfully set. Receipt: ${receipt?.hash}`);
  });

import * as readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = (prompt: string) =>
  new Promise<string>((resolve) => {
    rl.question(prompt, resolve);
  });

task("root-set-from-chapters", "Set root CID from chapters file")
  .addParam("chapters", "The file with all chapters")
  .setAction(async ({ chapters }: { chapters: string }, hre) => {
    const answer = await question(
      "Make sure you've update the app otherwise you'll break everything and you will be blamed forever. Please type 'GoOoooOOoo' to continue.\n"
    );

    if (answer !== "GoOoooOOoo") {
      process.exit(0);
    }

    const { cid } = loadChapters(chapters);
    const thcContract = (await loadContract(
      hre,
      "TreasureHuntCreator"
    )) as TreasureHuntCreator;
    console.log(
      `Setting root CID ${cid} for contract ${await thcContract.getAddress()}`
    );
    const tx = await thcContract.setup(cid);
    console.log(`  Transaction submitted. Waiting for 3 confirmation....`);
    const receipt = await tx.wait(3);
    console.log(`  Root CID successfully set. Receipt: ${receipt?.hash}`);
  });

task("master-add", "Add a game master")
  .addPositionalParam("address", "The address of the game master")
  .setAction(async ({ address }: { address: string }, hre) => {
    const thcContract = await loadContract(hre, "TreasureHuntCreator");
    console.log(
      `Adding Game Master ${address} to contract ${thcContract.address}`
    );
    const GAME_MASTER_ROLE = await thcContract.GAME_MASTER_ROLE();
    const tx = await thcContract.grantRole(GAME_MASTER_ROLE, address);

    console.log(`  Transaction submitted. Waiting for 3 confirmation....`);
    const receipt = await tx.wait(3);
    console.log(`  Game Master successfully added. Receipt: ${receipt?.hash}`);
  });

task("current-chapter", "Check player current chapter")
  .addPositionalParam("address", "The address of the player")
  .setAction(async ({ address }: { address: string }, hre) => {
    const thcContract = await loadContract(hre, "TreasureHuntCreator");
    const chapter = await thcContract.playerToCurrentChapter(address);
    console.log(`Player ${address} is at chapter ${chapter}`);
  });

task("leaderboard", "Check leaderboard")
  .addPositionalParam("page", "Page")
  .setAction(async ({ page }: { page: number }, hre) => {
    const thcContract = await loadContract(hre, "TreasureHuntCreator");
    const leaderboard = await thcContract.getLeaderboard(page);
    console.log(leaderboard);
  });
