import { task } from "hardhat/config";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { TreasureHuntCreator } from "../typechain";

import {
  deployContract,
  deployUpgradeableContract,
  loadChapters,
  loadContract,
  loadKeys,
} from "./utils";
import { readFileSync } from "fs";
import { encodeTokenId } from "../test/utils";

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
        address: await contract.getAddress(),
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

task("solve", "Solve")
  .addParam("passwords", "The file with all passwords")
  .addParam("keys", "The file with all keys")
  .setAction(
    async ({ passwords, keys }: { passwords: string; keys: string }, hre) => {
      const treasure = await loadContract(hre, "Treasure");
      const thc = await loadContract(hre, "TreasureHuntCreator");

      const passwordList = readFileSync(passwords, "utf-8").split("\n");
      const keysList = readFileSync(keys, "utf-8")
        .split("\n")
        .map((x) => x.split(",")[0]);
      const [deployer] = await hre.ethers.getSigners();

      async function getSignature(signer: SignerWithAddress, solution: string) {
        let solutionBytes = hre.ethers.toUtf8Bytes(solution);
        let solutionDigest = hre.ethers.keccak256(solutionBytes);
        let wallet = new hre.ethers.Wallet(solutionDigest);
        let signature = await wallet.signMessage(
          hre.ethers.getBytes(signer.address)
        );

        return [signature, wallet.address];
      }

      for (let i = 4; i < passwordList.length; i++) {
        let password = passwordList[i];
        console.log(password);
        let [signature, solutionKey] = await getSignature(deployer, password);
        let { r, v, s } = hre.ethers.Signature.from(signature);
        const tx = await thc.connect(deployer).submit(v, r, s);
        await tx.wait(1);
      }

      for (let i = 0; i < keysList.length; i++) {
        let password = keysList[i];
        console.log(password);
        let [signature, solutionKey] = await getSignature(deployer, password);
        let { r, v, s } = hre.ethers.Signature.from(signature);
        const tx = await thc.connect(deployer).submitKey(v, r, s);
        await tx.wait(1);
      }

      console.log(
        await treasure.balanceOf(
          deployer.address,
          encodeTokenId(await thc.getAddress(), 1)
        )
      );
      console.log(
        await treasure.balanceOf(
          deployer.address,
          encodeTokenId(await thc.getAddress(), 5)
        )
      );
      console.log(
        await treasure.balanceOf(
          deployer.address,
          encodeTokenId(await thc.getAddress(), 2)
        )
      );
    }
  );

task("verify:tokens", "Verify Tokens").setAction(
  async ({ passwords, keys }: { passwords: string; keys: string }, hre) => {
    const treasure = await loadContract(hre, "Treasure");
    const thc = await loadContract(hre, "TreasureHuntCreator");

    const [deployer] = await hre.ethers.getSigners();

    console.log(
      await treasure.balanceOf(
        deployer.address,
        encodeTokenId(await thc.getAddress(), 1)
      )
    );
    console.log(
      await treasure.balanceOf(
        deployer.address,
        encodeTokenId(await thc.getAddress(), 5)
      )
    );
    console.log(
      await treasure.balanceOf(
        deployer.address,
        encodeTokenId(await thc.getAddress(), 2)
      )
    );
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
