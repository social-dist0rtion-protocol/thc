import thc from "../thc.json";
import { treasureHuntCreatorAddress } from "./generated";

export const MAP_URL = thc.mapUrl;
export const HELP_URL = thc.helpUrl;
export const CHAIN_ID = thc.chainId;
export const APP_NAME =
  treasureHuntCreatorAddress[
    CHAIN_ID as keyof typeof treasureHuntCreatorAddress
  ];
export const GELATO_FEE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
export const RPC_NODE_URL = import.meta.env.VITE_RPC_NODE_URL;
export const WALLET_CONNECT_PROJECT_ID = import.meta.env
  .VITE_WALLET_CONNECT_PROJECT_ID;
