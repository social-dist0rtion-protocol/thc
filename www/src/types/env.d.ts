/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INFURA_API_KEY: string;
  readonly VITE_ETHEREUM_ENDPOINT: string;
  readonly VITE_ETHEREUM_CHAIN_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
