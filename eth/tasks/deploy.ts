import { task } from "hardhat/config";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { TreasureHuntCreator } from "../typechain";
import { readMetadata, readRootHash } from "./lib";

import {
  deployContract,
  deployUpgradeableContract,
  loadContract,
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
  .addParam("cbd", "Content base directory")
  .addFlag("verify", "Verify")
  .setAction(async ({ cbd, verify }: { cbd: string; verify: boolean }, hre) => {
    console.log("Deploy contract Treasure Hunt Creator");
    const [deployer] = await hre.ethers.getSigners();
    console.log("Address:", deployer.address);
    console.log(`  CBD: ${cbd}`);

    const rootHash = await readRootHash(cbd);
    console.log(`Root: ${rootHash}`);
    const { keys, chapters } = await readMetadata(cbd);
    console.log(`Chapters: ${chapters}`);

    const treasure = await loadContract(hre, "Treasure");
    const [contract, networkFile, argsFile] = await deployContract(
      hre,
      "TreasureHuntCreator",
      {},
      chapters,
      keys.map((k) => k.address),
      await treasure.getAddress()
    );

    const receipt = await treasure.grantRole(
      await treasure.TREASURE_HUNT_ROLE(),
      await contract.getAddress()
    );
    await receipt.wait(5);

    const thcContract = contract as unknown as TreasureHuntCreator;
    await thcContract.setup(rootHash);

    if (verify) {
      // It is recommended to wait for 5 confirmations before issuing the verification request
      console.log("Verfication in progress...");
      await hre.run("verify", {
        address: await thcContract.getAddress(),
        constructorArgs: argsFile,
        contract: "contracts/TreasureHuntCreator.sol:TreasureHuntCreator",
      });
    }
  });

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

task("get:token", "Get Tokens").setAction(
  async ({ passwords, keys }: { passwords: string; keys: string }, hre) => {
    const treasure = await loadContract(hre, "Treasure");
    const thc = await loadContract(hre, "TreasureHuntCreator");

    const [deployer] = await hre.ethers.getSigners();

    const base64Content = await treasure.uri(
      encodeTokenId(await thc.getAddress(), 1)
    );
    console.log(atob(base64Content.slice(29)));
    const content = JSON.parse(atob(base64Content.slice(29)));
    console.log(content);
  }
);

task("setup:thc", "Setup THC")
  .addParam("renderer", "Renderer name")
  .addFlag("verify", "Verify")
  .setAction(
    async (
      { renderer, verify }: { renderer: string; verify: boolean },
      hre
    ) => {
      const [rendererContract, , argsFile] = await deployContract(
        hre,
        renderer,
        {},
        []
      );
      const treasure = await loadContract(hre, "Treasure");
      const thc = await loadContract(hre, "TreasureHuntCreator");

      await treasure.updateRenderer(
        await thc.getAddress(),
        await rendererContract.getAddress()
      );

      if (verify) {
        // It is recommended to wait for 5 confirmations before issuing the verification request
        console.log("Verfication in progress...");
        await hre.run("verify", {
          address: await rendererContract.getAddress(),
          constructorArgs: argsFile,
          contract: `contracts/Renderers/${renderer}.sol:${renderer}`,
        });
      }
    }
  );
