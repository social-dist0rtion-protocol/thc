import { task } from "hardhat/config";
import { writeFile } from "fs/promises";
import { readFileSync } from "fs";
import { TreasureHuntCreator__factory } from "../typechain";
import { CID } from "multiformats"

type Chapter = {
  questHash: string;
  solutionAddress: string;
};

task("deploy", "Push THC to network")
  .addParam("chapters", "The file with all chapters")
  .setAction(async ({ chapters }: { chapters: string }, hre) => {
    console.log("Deploy contract Treasure Hunt Creator");
    const [deployer] = await hre.ethers.getSigners();
    console.log("Address:", deployer.address);
    const thcFactory = (await hre.ethers.getContractFactory(
      "TreasureHuntCreator"
    )) as TreasureHuntCreator__factory;
    console.log(`  Chapters file: ${chapters}`);
    const chaptersData = JSON.parse(readFileSync(chapters, "utf-8"));

    let solutions: string[] = [];

    chaptersData.map((chapter: Chapter) => {
      solutions.push(chapter.solutionAddress);
    });

    const questsRootCid = CID.parse(chaptersData[0].questHash.split("/")[0]).bytes

    const thcContract = await thcFactory.deploy(solutions, questsRootCid);
    console.log("  Address", thcContract.address);
    const receipt = await thcContract.deployed();
    console.log("  Receipt", receipt.deployTransaction.hash);

    const questsRootCidArg = await thcContract.getQuestsRootCID()

    const { chainId } = await hre.ethers.provider.getNetwork();

    const config = {
      [chainId]: {
        TreasureHuntCreator: thcContract.address,
      },
    };

    const networkParam = hre.network.name;
    const networkFile = `./deployments/${networkParam}.network.json`;
    const argsFile = `./deployments/${networkParam}.args.json`;

    console.log("Network file", networkFile);
    await writeFile(networkFile, JSON.stringify(config, null, 2));

    console.log("Arguments file", argsFile);
    await writeFile(
      argsFile,
      JSON.stringify([solutions, questsRootCidArg])
    );

    if (networkParam !== "localhost") {
      // It is recommended to wait for 5 confirmations before issuing the verification request
      console.log("Verfication in progress...");
      await thcContract.deployTransaction.wait(3);
      await hre.run("verify", {
        address: thcContract.address,
        constructorArgs: argsFile,
        contract: "contracts/TreasureHuntCreator.sol:TreasureHuntCreator",
      });
    }
  });
