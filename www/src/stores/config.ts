type ContractsAddresses = {
  [key: string]: string;
};

export const contractsAddresses: ContractsAddresses =
  // @ts-ignore
  __VITE_CONTRACTS_ADDRESSES__;

export const infuraKey: string = import.meta.env.VITE_INFURA_API_KEY;
export const ethereumEndpoint: string = import.meta.env.VITE_ETHEREUM_ENDPOINT;
export const ethereumChainId: number = parseInt(
  import.meta.env.VITE_ETHEREUM_CHAIN_ID,
  10
);
