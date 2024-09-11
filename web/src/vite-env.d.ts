/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_MAP_URL: string;
  readonly VITE_HELP_URL: string;
  readonly VITE_RPC_NODE_URL: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_GELATO_FEE_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
