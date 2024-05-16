import { task } from "hardhat/config";
import { writeFile } from "fs/promises";
import { TreasureHuntCreator__factory } from "../typechain";
import { loadChapters, loadKeys } from "./utils";

const GELATOR_RELAYER = "0xd8253782c45a12053594b9deb72d8e8ab2fca54c";

task("deploy", "Push THC to network")
  .addParam("chapters", "The file with all chapters")
  .addParam("mnemonics", "The file with all mnemonics")
  .setAction(
    async (
      { chapters, mnemonics }: { chapters: string; mnemonics: string },
      hre
    ) => {
      console.log("Deploy contract Treasure Hunt Creator");
      const [deployer] = await hre.ethers.getSigners();
      console.log("Address:", deployer.address);
      const thcFactory = (await hre.ethers.getContractFactory(
        "TreasureHuntCreator"
      )) as TreasureHuntCreator__factory;
      console.log(`  Chapters file: ${chapters}`);

      const { cidBytes, solutions } = loadChapters(chapters);
      const keys = loadKeys(mnemonics);

      const thcContract = await thcFactory.deploy(
        solutions,
        keys,
        cidBytes,
        GELATOR_RELAYER
      );
      console.log("  Address", thcContract.address);
      const receipt = await thcContract.deployed();
      console.log("  Receipt", receipt.deployTransaction.hash);

      const questsRootCidArg = await thcContract.getQuestsRootCID();

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
        JSON.stringify([solutions, keys, questsRootCidArg])
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
    }
  );
