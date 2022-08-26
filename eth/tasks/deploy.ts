import { task } from "hardhat/config";
import { writeFile } from "fs/promises";
import { readFileSync } from "fs";
import { TreasureHuntCreator__factory } from "../typechain";
//import { b58 } from "base-58";

task("push", "Push THC to network")
  .addParam("chapters", "the chapter file")
  .setAction(async ({ chapterFile }: { chapterFile: string }, hre) => {
    console.log("Deploy contract Treasure Hunt Creator");
    const tchFactory = (await hre.ethers.getContractFactory(
      "TreasureHuntCreator"
    )) as TreasureHuntCreator__factory;

    const chapters = JSON.parse(readFileSync(chapterFile, "utf-8"));
    let solutions: string[] = [];
    let quests: string[] = [];

    /*chapters.map((chapter) => {
      const questHash = chapter["questHash"];
      const decoded = b58.decode(questHash);
      const quest = web3.utils.bytesToHex(decoded.slice(2));
      quests.push(quest);
      solutions.push(chapter["solutionAddress"]);
    });*/

    const storageContract = await tchFactory.deploy(solutions, quests);
    console.log("  Address", storageContract.address);
    const receipt = await storageContract.deployed();
    console.log("  Receipt", receipt.deployTransaction.hash);

    const { chainId } = await hre.ethers.provider.getNetwork();

    const config = {
      [chainId]: {
        Storage: storageContract.address,
      },
    };

    console.log("Configuration file in ./artifacts/network.json");
    await writeFile(
      "./artifacts/network.json",
      JSON.stringify(config, null, 2)
    );

    // It is recommended to wait for 5 confirmations before issuing the verification request
    await storageContract.deployTransaction.wait(5);
    await hre.run("verify", {
      address: storageContract.address,
      contract: "contracts/Storage.sol:Storage",
      //constructorArgsParams: []
    });
  });
