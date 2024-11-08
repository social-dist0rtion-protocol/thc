import { readFileSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  DisappearRenderer__factory,
  SybilDefenseRenderer__factory,
  TreasureHuntCreator__factory,
  Treasure__factory,
  SybilDefenseRenderer__factory,
} from "../typechain";
import {
  Contract,
  Mnemonic,
  Wallet,
  keccak256,
  toUtf8Bytes,
  wordlists,
} from "ethers";

const CONFIG_FILE_PATH = "deployments";

const FACTORIES: Record<string, any> = {
  TreasureHuntCreator: TreasureHuntCreator__factory,
  Treasure: Treasure__factory,
  DisappearRenderer: DisappearRenderer__factory,
  SybilDefenseRenderer: SybilDefenseRenderer__factory,
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
  const networkFile = `${configPath}/${hre.network.name}.network.json`;
  const networks: any = JSON.parse(await readFile(networkFile, "utf8"));
  const chainId = (await hre.ethers.provider.getNetwork()).chainId.toString();

  let addresses: any = {};
  if (chainId in networks) addresses = networks[chainId];
  else networks[chainId] = addresses;
  addresses[contractName] = address;

  await writeFile(networkFile, JSON.stringify(networks, null, 2));

  console.log(
    `   Address ${address} stored for ${contractName} at ${networkFile}`
  );

  return networkFile;
}

export async function storeContractArgs(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  args: any[],
  configPath: string = CONFIG_FILE_PATH
) {
  await hre.ethers.getSigners();
  const argsFile = `./${configPath}/${contractName}.${hre.network.name}.args.json`;
  await writeFile(argsFile, JSON.stringify(args));

  console.log(`   Args stored for ${contractName} at ${argsFile}`);

  return argsFile;
}

export async function deployContract(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  libraries = {},
  ...args: any[]
): Promise<[Contract, string, string]> {
  console.log(`Deploy ${contractName} to ${hre.network.name}...`);
  const factory = await hre.ethers.getContractFactory(contractName, {
    libraries: libraries,
  });
  const contract = await factory.deploy(...args);

  console.log("   Waiting for 2 confirmations...");
  await contract.deploymentTransaction()?.wait(2);

  const networkFile = await storeContractAddress(
    hre,
    contractName,
    await contract.getAddress()
  );
  const argsFile = await storeContractArgs(hre, contractName, args);

  return [contract as Contract, networkFile, argsFile];
}

export async function deployUpgradeableContract(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  libraries = {},
  ...args: any[]
): Promise<[Contract, string, string]> {
  console.log(`Deploying ${contractName} to ${hre.network.name}`);
  const factory = await hre.ethers.getContractFactory(contractName, {
    libraries: libraries,
  });
  const contract = await hre.upgrades.deployProxy(factory, ...args);
  console.log("   Waiting for 2 confirmations...");
  await contract.deploymentTransaction()?.wait(2);

  const networkFile = await storeContractAddress(
    hre,
    contractName,
    await contract.getAddress()
  );
  const argsFile = await storeContractArgs(hre, contractName, args);

  return [contract, networkFile, argsFile];
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
    .map((x) => x.split(",")[0])
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
