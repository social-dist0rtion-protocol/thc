import { readFileSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { TreasureHuntCreator__factory } from "../typechain";
import { CID } from "multiformats";
import { Wallet, utils, wordlists } from "ethers";

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
  await contract.deployTransaction.wait(5);

  await storeContractAddress(hre, contractName, contract.address);

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
  const addresses = networks[chainId];

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

  const cidBytes = CID.parse(cid).bytes;

  return { cid, cidBytes, solutions };
}

export function loadKeys(path: string) {
  const keys = readFileSync(path, "utf-8")
    .split("\n")
    .map((x) => x.trim())
    .map((x) => {
        const wordlist = getCorrespondingWordlist(x);
        return Wallet.fromMnemonic(x, undefined, wordlist).address
    });

  return keys;
}

export function getCorrespondingWordlist(mnemonic: string) {
    for (let locale in wordlists) {
        const wordlist = wordlists[locale];
        if (utils.isValidMnemonic(mnemonic, wordlist)) {
            return wordlists[locale];
        }
    }
}
