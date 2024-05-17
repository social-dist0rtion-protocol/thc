import { task } from "hardhat/config";
import { writeFile } from "fs/promises";
import {
  TreasureHuntCreator,
  TreasureHuntCreator__factory,
} from "../typechain";

import { loadChapters, loadContract, loadKeys } from "./utils";
import { toUtf8Bytes } from "ethers";

task("deploy", "Push THC to network")
  .addParam("chapters", "The file with all chapters")
  .addParam("keysPath", "The file with all keys")
  .setAction(
    async (
      { chapters, keysPath }: { chapters: string; keysPath: string },
      hre
    ) => {
      console.log("Deploy contract Treasure Hunt Creator");
      const [deployer] = await hre.ethers.getSigners();
      console.log("Address:", deployer.address);
      const thcFactory = (await hre.ethers.getContractFactory(
        "TreasureHuntCreator"
      )) as TreasureHuntCreator__factory;
      console.log(`  Chapters file: ${chapters}`);

      const { cid, solutions } = loadChapters(chapters);
      console.log(cid);
      const keys = loadKeys(keysPath);

      const thcContract = await thcFactory.deploy(
        solutions,
        keys,
        "0x0000000000000000000000000000000000000000"
      );
      const receipt = thcContract.deploymentTransaction();
      console.log("  Receipt", receipt?.hash);
      console.log("wait");
      await new Promise((r) => setTimeout(r, 10000));
      console.log("ended");

      await thcContract.setup(cid);

      const { chainId } = await hre.ethers.provider.getNetwork();

      const config = {
        [Number(chainId)]: {
          TreasureHuntCreator: await thcContract.getAddress(),
        },
      };

      const networkParam = hre.network.name;
      const networkFile = `./deployments/${networkParam}.network.json`;
      const argsFile = `./deployments/${networkParam}.args.json`;

      console.log("Network file", networkFile);
      await writeFile(networkFile, JSON.stringify(config, null, 2));

      console.log("Arguments file", argsFile);
      await writeFile(argsFile, JSON.stringify([solutions, keys, cid]));

      return;
      if (networkParam !== "localhost") {
        // It is recommended to wait for 5 confirmations before issuing the verification request
        console.log("Verfication in progress...");
        await thcContract.deploymentTransaction()?.wait(3);
        await hre.run("verify", {
          address: await thcContract.getAddress(),
          constructorArgs: argsFile,
          contract: "contracts/TreasureHuntCreator.sol:TreasureHuntCreator",
        });
      }
    }
  );

task("submit", "send tx").setAction(async (_, hre) => {
  const thcContract = (await loadContract(
    hre,
    "TreasureHuntCreator"
  )) as TreasureHuntCreator;

  const r = await thcContract.submit(
    0,
    toUtf8Bytes("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
    toUtf8Bytes("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
  );
  console.log(r.hash);
  await r.wait(4);
});
