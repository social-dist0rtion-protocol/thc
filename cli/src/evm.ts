import {
  Client,
  createPublicClient,
  createWalletClient,
  getContract,
  Hex,
  http,
} from "viem";
import { mainnet, localhost, optimism, sepolia } from "viem/chains";
import TreasureHuntCreatorAbi from "./TreasureHuntCreator.json";
import { privateKeyToAccount } from "viem/accounts";
import { LeaderboardEntry, processLeaderboard } from "./lib";

const ID_TO_CHAIN = {
  [mainnet.id]: mainnet,
  [localhost.id]: localhost,
  [optimism.id]: optimism,
  [sepolia.id]: sepolia,
};

type ValidChainId = keyof typeof ID_TO_CHAIN;

function isValidChainId(chainId: number): chainId is ValidChainId {
  return chainId in ID_TO_CHAIN;
}

export function getWallet(privateKey: Hex, chainId: number, endpoint: string) {
  if (!isValidChainId(chainId)) {
    throw new Error("Cannot find chainId");
  }

  const chain = ID_TO_CHAIN[chainId];
  const account = privateKeyToAccount(privateKey);

  return createWalletClient({
    account,
    chain,
    transport: http(endpoint),
  });
}

export function getPublicClient(chainId: number, endpoint: string) {
  // If anyone can explain me how to use a wallet client to call
  return createPublicClient({
    chain: mainnet,
    transport: http(endpoint),
  });
}

export async function getRootHash(client: Client, address: Hex) {
  const contract = getContract({
    address,
    abi: TreasureHuntCreatorAbi.abi,
    client,
  });

  return await contract.read.getQuestsRootCID();
}

export async function setRootHash(client: Client, address: Hex, rootHash: Hex) {
  const contract = getContract({
    address,
    abi: TreasureHuntCreatorAbi.abi,
    client,
  });

  return await contract.write.setup([rootHash]);
}

export async function getLeaderboard(
  client: Client,
  address: Hex,
  totalKeys: number,
  emojis: string[]
) {
  const contract = getContract({
    address,
    abi: TreasureHuntCreatorAbi.abi,
    client,
  });

  let leaderboard: LeaderboardEntry[] = [];
  let nextPage: null | number = 0;

  for (let i = 0; ; i++) {
    const rawLeaderboard: any = await contract.read.getLeaderboard([nextPage]);

    ({ leaderboard, nextPage } = processLeaderboard(
      rawLeaderboard,
      nextPage,
      leaderboard,
      totalKeys,
      emojis
    ));

    if (nextPage === null) {
      break;
    }
  }
  return leaderboard;
}
