import type { ethers } from "ethers";

export const CHAIN_CONFIGS = {
  "0x89": {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://www.polygonscan.com"],
  },
};

function isKeyOfChainConfigs(
  chainId: string
): chainId is keyof typeof CHAIN_CONFIGS {
  return chainId in CHAIN_CONFIGS;
}

export async function addEthereumChain(
  web3Provider: ethers.providers.Web3Provider,
  chainId: string
) {
  if (isKeyOfChainConfigs(chainId)) {
    const chainConfig = CHAIN_CONFIGS[chainId];

    await web3Provider.provider.request!({
      method: "wallet_addEthereumChain",
      params: [chainConfig],
    });
  } else {
    throw "Cannot find network configuration";
  }
}
