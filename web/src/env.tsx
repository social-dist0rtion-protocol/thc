import thc from "../thc.json";

export const APP_NAME = import.meta.env.VITE_APP_NAME;
export const MAP_URL = import.meta.env.VITE_MAP_URL;
export const HELP_URL = import.meta.env.VITE_HELP_URL;
export const RPC_NODE_URL = import.meta.env.VITE_RPC_NODE_URL;
export const CHAIN_ID = thc.chainId;
export const GELATO_FEE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
export const WALLET_CONNECT_PROJECT_ID = import.meta.env
  .VITE_WALLET_CONNECT_PROJECT_ID;
