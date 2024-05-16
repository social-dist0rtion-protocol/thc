type ContractsAddresses = {
  [key: string]: string;
};

export const contractsAddresses: ContractsAddresses =
  // @ts-ignore
  __VITE_CONTRACTS_ADDRESSES__;

export const infuraKey = import.meta.env.VITE_INFURA_API_KEY;

export const ethereumFaucetEndpoint = import.meta.env
  .VITE_ETHEREUM_FAUCET_ENDPOINT;

export const ethereumEndpoint = import.meta.env.VITE_ETHEREUM_ENDPOINT;
export const ethereumChainId = parseInt(
  import.meta.env.VITE_ETHEREUM_CHAIN_ID,
  10
);
