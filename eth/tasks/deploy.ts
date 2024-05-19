import { task } from "hardhat/config";
import { TreasureHuntCreator } from "../typechain";

import {
  deployContract,
  deployUpgradeableContract,
  loadChapters,
  loadContract,
  loadKeys,
} from "./utils";
import { toUtf8Bytes } from "ethers";

task("deploy:treasure", "Push Treasure to network")
  .addFlag("verify", "Verify")
  .setAction(async ({ verify }: { verify: boolean }, hre) => {
    const [contract, networkFile, argsFile] = await deployUpgradeableContract(
      hre,
      "Treasure",
      {},
      []
    );
    if (verify) {
      // It is recommended to wait for 5 confirmations before issuing the verification request
      console.log("Verfication in progress...");
      await hre.run("verify", {
        address: await contract.address,
        constructorArgs: argsFile,
        contract: "contracts/Treasure.sol:Treasure",
      });
    }
  });

task("deploy:thc", "Push THC to network")
  .addParam("chapters", "The file with all chapters")
  .addParam("keysPath", "The file with all keys")
  .addFlag("verify", "Verify")
  .setAction(
    async (
      {
        chapters,
        keysPath,
        verify,
      }: { chapters: string; keysPath: string; verify: boolean },
      hre
    ) => {
      console.log("Deploy contract Treasure Hunt Creator");
      const [deployer] = await hre.ethers.getSigners();
      console.log("Address:", deployer.address);
      console.log(`  Chapters file: ${chapters}`);

      const { cid, solutions } = loadChapters(chapters);
      console.log(cid);
      const keys = loadKeys(keysPath);
      const treasure = await loadContract(hre, "Treasure");
      const [contract, networkFile, argsFile] = await deployContract(
        hre,
        "TreasureHuntCreator",
        {},
        solutions,
        keys,
        await treasure.getAddress()
      );
      await treasure.grantRole(
        await treasure.TREASURE_HUNT_ROLE(),
        await contract.getAddress()
      );

      const thcContract = contract as unknown as TreasureHuntCreator;
      await thcContract.setup(cid);

      if (verify) {
        // It is recommended to wait for 5 confirmations before issuing the verification request
        console.log("Verfication in progress...");
        await hre.run("verify", {
          address: await thcContract.getAddress(),
          constructorArgs: argsFile,
          contract: "contracts/TreasureHuntCreator.sol:TreasureHuntCreator",
        });
      }
    }
  );

task("setup:disappear", "Push Disappear to network")
  .addFlag("verify", "Verify")
  .setAction(async ({ verify }: { verify: boolean }, hre) => {
    const [renderer, , argsFile] = await deployContract(
      hre,
      "DisappearRenderer",
      {},
      []
    );
    const treasure = await loadContract(hre, "Treasure");
    const thc = await loadContract(hre, "TreasureHuntCreator");

    await treasure.updateRenderer(
      await thc.getAddress(),
      await renderer.getAddress()
    );

    if (verify) {
      // It is recommended to wait for 5 confirmations before issuing the verification request
      console.log("Verfication in progress...");
      await hre.run("verify", {
        address: await renderer.getAddress(),
        constructorArgs: argsFile,
        contract: "contracts/Renderers/DisappearRenderer.sol:DisappearRenderer",
      });
    }
  });

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
