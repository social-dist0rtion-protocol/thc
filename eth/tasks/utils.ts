import { readFileSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { TreasureHuntCreator__factory } from "../typechain";
import { Mnemonic, Wallet, keccak256, toUtf8Bytes, wordlists } from "ethers";

const CONFIG_FILE_PATH = "./deployments";

const FACTORIES: Record<string, any> = {
  TreasureHuntCreator: TreasureHuntCreator__factory,
};

type Chapter = {
  questHash: string;
  solutionAddress: string;
};

export async function storeContractAddress(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  address: string,
  configPath: string = CONFIG_FILE_PATH
) {
  const networks: any = JSON.parse(
    await readFile(`${configPath}/${hre.network.name}.network.json`, "utf8")
  );
  const chainId = hre.network.config.chainId!;

  let addresses: any = {};
  if (chainId in networks) addresses = networks[chainId];
  else networks[chainId] = addresses;

  addresses[contractName] = address;

  await writeFile(configPath, JSON.stringify(networks, null, 2));

  console.log(
    `   Address ${address} stored for ${contractName} at ${configPath}`
  );
}

export async function deployContract(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  libraries = {},
  ...args: any[]
) {
  const factory = await hre.ethers.getContractFactory(contractName, {
    libraries: libraries,
  });
  const contract = await factory.deploy(...args);

  console.log("   Waiting for 5 confirmations...");
  await contract.deploymentTransaction()?.wait(5);

  await storeContractAddress(hre, contractName, await contract.getAddress());

  return contract;
}

export async function loadContract(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  configPath: string = CONFIG_FILE_PATH
) {
  const networks: any = JSON.parse(
    await readFile(`${configPath}/${hre.network.name}.network.json`, "utf8")
  );
  const [deployer] = await hre.ethers.getSigners();
  const { chainId } = await hre.ethers.provider.getNetwork();
  const addresses = networks[Number(chainId)];

  let contract;
  if (addresses !== undefined && contractName in addresses) {
    const address = addresses[contractName];
    contract = FACTORIES[contractName].connect(address, deployer);
  }

  return contract;
}

export function loadChapters(path: string) {
  const chaptersData = JSON.parse(readFileSync(path, "utf-8"));
  let solutions: string[] = [];

  chaptersData.map((chapter: Chapter) => {
    solutions.push(chapter.solutionAddress);
  });
  const cid = chaptersData[0].questHash.split("/")[0];

  const cidBytes = toUtf8Bytes(cid);

  return { cid, cidBytes, solutions };
}

export function loadKeys(path: string) {
  const keys = readFileSync(path, "utf-8")
    .trim()
    .split("\n")
    .map((x) => x.trim())
    .map((x) => {
      x = x.toLowerCase();
      // Generate the hash of the value
      const hash = keccak256(toUtf8Bytes(x));
      // Generate wallet using the 32 bytes from the hash
      const solutionWallet = new Wallet(hash);
      return solutionWallet.address;
    });

  return keys;
}

export function getCorrespondingWordlist(mnemonic: string) {
  for (let locale in wordlists) {
    const wordlist = wordlists[locale];
    if (Mnemonic.isValidMnemonic(mnemonic, wordlist)) {
      return wordlists[locale];
    }
  }
}
