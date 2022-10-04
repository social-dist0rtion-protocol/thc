import { task } from "hardhat/config";
import { TreasureHuntCreator } from "../typechain";
import { CID } from "multiformats";
import { loadChapters, loadContract } from "./utils";
import { readFileSync } from "fs";

task("root-set", "Set root CID")
  .addPositionalParam("cid", "The file with all chapters")
  .setAction(async ({ cid }: { cid: string }, hre) => {
    const thcContract = (await loadContract(
      hre,
      "TreasureHuntCreator"
    )) as TreasureHuntCreator;
    console.log(`Setting root CID ${cid} for contract ${thcContract.address}`);
    const cidBytes = CID.parse(cid).bytes;
    const tx = await thcContract.setQuestsRootCID(cidBytes);

    console.log(`  Transaction submitted. Waiting for 3 confirmation....`);
    const receipt = await tx.wait(3);
    console.log(
      `  Root CID successfully set. Receipt: ${receipt.transactionHash}`
    );
  });

task("root-set-from-chapters", "Set root CID from chapters file")
  .addParam("chapters", "The file with all chapters")
  .setAction(async ({ chapters }: { chapters: string }, hre) => {
    const { cid, cidBytes } = loadChapters(chapters);
    const thcContract = (await loadContract(
      hre,
      "TreasureHuntCreator"
    )) as TreasureHuntCreator;
    console.log(`Setting root CID ${cid} for contract ${thcContract.address}`);
    const tx = await thcContract.setQuestsRootCID(cidBytes);
    console.log(`  Transaction submitted. Waiting for 3 confirmation....`);
    const receipt = await tx.wait(3);
    console.log(
      `  Root CID successfully set. Receipt: ${receipt.transactionHash}`
    );
  });

task("master-add", "Add a game master")
  .addPositionalParam("address", "The address of the game master")
  .setAction(async ({ address }: { address: string }, hre) => {
    const thcContract = (await loadContract(
      hre,
      "TreasureHuntCreator"
    )) as TreasureHuntCreator;
    console.log(
      `Adding Game Master ${address} to contract ${thcContract.address}`
    );
    const GAME_MASTER_ROLE = await thcContract.GAME_MASTER_ROLE();
    const tx = await thcContract.grantRole(GAME_MASTER_ROLE, address);

    console.log(`  Transaction submitted. Waiting for 3 confirmation....`);
    const receipt = await tx.wait(3);
    console.log(
      `  Game Master successfully added. Receipt: ${receipt.transactionHash}`
    );
  });
