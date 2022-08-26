import { task } from "hardhat/config";
import { writeFile } from "fs/promises";
import { readFileSync } from "fs";
import { TreasureHuntCreator__factory } from "../typechain";
import { decode } from "bs58";
import { hexlify } from "ethers/lib/utils";

type Chapter = {
  questHash: string;
  solutionAddress: string;
};

task("deploy", "Push THC to network")
  .addParam("chapterFile", "the chapter file")
  .setAction(async ({ chapterFile }: { chapterFile: string }, hre) => {
    console.log("Deploy contract Treasure Hunt Creator");
    const tchFactory = (await hre.ethers.getContractFactory(
      "TreasureHuntCreator"
    )) as TreasureHuntCreator__factory;
    console.log(`  Chapter file: ${chapterFile}`);
    const chapters = JSON.parse(readFileSync(chapterFile, "utf-8"));

    let solutions: string[] = [];
    let quests: string[] = [];

    chapters.map((chapter: Chapter) => {
      const questHash = chapter.questHash;
      const decoded = decode(questHash);
      const quest = "0x" + Buffer.from(decoded.slice(2)).toString("hex");
      quests.push(quest);
      solutions.push(chapter.solutionAddress);
    });

    const thcContract = await tchFactory.deploy(solutions, quests);
    console.log("  Address", thcContract.address);
    const receipt = await thcContract.deployed();
    console.log("  Receipt", receipt.deployTransaction.hash);

    const { chainId } = await hre.ethers.provider.getNetwork();

    const config = {
      [chainId]: {
        TreasureHuntCreator: thcContract.address,
      },
    };

    console.log("Configuration file in ./deployment/network.json");
    await writeFile(
      "./deployment/network.json",
      JSON.stringify(config, null, 2)
    );

    console.log("Arguments file in ./deployment/arguments.js");
    await writeFile(
      "./deployment/arguments.js",
      `module.exports = ${JSON.stringify([solutions, quests])}`
    );

    // It is recommended to wait for 5 confirmations before issuing the verification request
    console.log("Verfication in progress...");
    await thcContract.deployTransaction.wait(3);
    await hre.run("verify", {
      address: thcContract.address,
      constructorArgs: "./deployment/arguments.js",
      contract: "contracts/TreasureHuntCreator.sol:TreasureHuntCreator",
    });
  });
