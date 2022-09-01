import Web3Modal from "web3modal";

// Would definitely prefer to import walletconnect with
// import WalletConnectProvider from "@walletconnect/web3-provider";
// but it's a nightmare, see https://github.com/vitejs/vite/issues/7257#issuecomment-1079579892
import WalletConnectProvider from "@walletconnect/web3-provider/dist/umd/index.min.js";
import { infuraKey } from "./config";

let web3Modal: Web3Modal;
let web3ModalConnection: any;

/**
 * Initialize Web3Modal.
 *
 * @returns An initialized instance of Web3Modal.
 */
export async function initWeb3Modal() {
  if (web3Modal) {
    return web3Modal;
  }
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        /*
        rpc: {
          137: "https://matic-mainnet.chainstacklabs.com",
        },
        */
        infuraId: infuraKey,
      },
    },
  };
  web3Modal = new Web3Modal({
    //network: import.meta.env.VITE_ETHEREUM_DEFAULT_NETWORK,
    //cacheProvider: true,
    providerOptions,
  });
  return web3Modal;
}

/**
 * Prompt the user to connect their wallet.
 *
 * @returns A connection to the web3 agent.
 */
export async function connectWeb3Modal() {
  if (!web3Modal) {
    initWeb3Modal();
  }
  if (web3ModalConnection) {
    web3ModalConnection.removeAllListeners();
  }
  web3ModalConnection = await web3Modal.connect();
  return web3ModalConnection;
}

/**
 * Disconnect to the web3 agent.
 */
export async function disconnectWeb3Modal() {
  if (web3Modal) {
    web3Modal.clearCachedProvider();
  }
  if (web3ModalConnection) {
    web3ModalConnection.removeAllListeners();
  }
}
