import type { BrowserProvider } from "ethers";

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
  web3Provider: BrowserProvider,
  chainId: string
) {
  if (isKeyOfChainConfigs(chainId)) {
    const chainConfig = CHAIN_CONFIGS[chainId];

    await web3Provider.send("wallet_addEthereumChain", [chainConfig]);
  } else {
    throw "Cannot find network configuration";
  }
}
