/*
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers";
import { ethereumEndpoint } from "./config";
import { BrowserProvider } from "ethers";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "79d61b41ea6f830547a2ed792050e048";

// 2. Set chains
const mainnet = {
  chainId: 11155111,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: ethereumEndpoint,
};

// 3. Create your application's metadata object
const metadata = {
  name: "Disappear",
  description: "Disappear",
  url: "http://localhost:5174/", // url must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  // Required
  metadata,

  // Optional
  rpcUrl: ethereumEndpoint, // used for the Coinbase SDK
  defaultChainId: 11155111, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
export const modal = createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

export async function connect() {
  await modal.open();
  const walletProvider = modal.getWalletProvider();
  if (!walletProvider) {
    throw new Error("Cannot get wallet provider");
  }
  const ethersProvider = new BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
}
*/
