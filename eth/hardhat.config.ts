import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";

import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";

import("./tasks").catch((e) => console.log("Cannot load tasks", e.toString()));

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY!;
const PRIVATE_KEY =
  process.env.SEPOLIA_PRIVATE_KEY! ||
  "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"; // well known private key
const TEST_PRIVATE_KEY =
  process.env.GOERLI_PRIVATE_KEY! ||
  "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"; // well known private key
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_KEY = process.env.COINMARKETCAP_KEY || "";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.21",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {},
    localhost: {
      url: "http://localhost:8545",
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY!}`,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/b9iDb59-u1ySOnZoqJBxQSN2nlRutFMr",
      accounts: [TEST_PRIVATE_KEY],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: !!process.env.GAS_REPORTER,
    currency: "USD",
    gasPrice: 100,
    coinmarketcap: COINMARKETCAP_KEY,
  },
  typechain: {
    outDir: "./typechain",
  },
};

export default config;
