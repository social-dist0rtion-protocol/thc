import { ethers, Signer, BigNumber } from "ethers";
import { derived, writable, type Readable } from "svelte/store";
import { ethereumEndpoint, ethereumChainId } from "./config";
import { addEthereumChain } from "./networks";
import {
  connectWeb3Modal,
  disconnectWeb3Modal,
  initWeb3Modal,
} from "./web3Modal";

export async function init() {
  localStorage.removeItem("walletconnect");
  await initWeb3Modal();
  await connectReadOnly();
}

export async function connect() {
  const connection = await connectWeb3Modal();

  async function resetProvider(promptNetwork = false) {
    const web3Provider = new ethers.providers.Web3Provider(connection);
    const { name, chainId } = await web3Provider.getNetwork();

    if (chainId !== ethereumChainId) {
      if (promptNetwork && web3Provider.provider?.request) {
        try {
          await web3Provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + ethereumChainId.toString(16) }],
          });
        } catch (e: any) {
          console.error(e);
          if (e.code === 4902) {
            try {
              await addEthereumChain(
                web3Provider,
                "0x" + ethereumChainId.toString(16)
              );
              console.log("Network added");
            } catch (e) {
              console.error(e);
            }
          } else {
            networkError.set({
              got: name,
              want:
                ethers.providers.getNetwork(ethereumChainId)?.name || "unknown",
            });
          }
        }
      } else {
        networkError.set({
          got: name,
          want: ethers.providers.getNetwork(ethereumChainId)?.name || "unknown",
        });
      }
    } else {
      networkError.set(null);
    }
    provider.set(web3Provider);
  }
  await resetProvider(true);
  connection.on("accountsChanged", (accounts: string[]) => {
    console.log("User changed account", accounts);
    accountsChanged.set(Date.now());
  });
  connection.on("chainChanged", async (newChainId: number) => {
    console.log("User changed network", newChainId);
    await resetProvider();
  });

  /*
  connection.on("connect", (info: { chainId: number }) => {
    console.log("connect", info);
  });
  connection.on("disconnect", (error: { code: number; message: string }) => {
    console.log("disconnect", error);
  });
  */
}

export async function connectReadOnly() {
  providerReadOnly.set(new ethers.providers.JsonRpcProvider(ethereumEndpoint));
}

export async function disconnect() {
  // FIXME: would be much better if this was handled by web3modal
  localStorage.removeItem("walletconnect");
  await disconnectWeb3Modal();
  await connectReadOnly();
  provider.set(null);
}

export const networkError = writable<{ got: string; want: string } | null>();

export const provider = writable<ethers.providers.Web3Provider | null>();

export const providerReadOnly =
  writable<ethers.providers.JsonRpcProvider | null>();

export const accountsChanged = writable(0);

export const signer: Readable<Signer | null> = derived(
  [provider, accountsChanged],
  ([$provider], set) => {
    if ($provider) {
      (async () => {
        const _signer = $provider.getSigner();
        let _address: string;
        // Check if signer has an address. A signer might not have any address
        // available if the user disconnects all accounts.
        try {
          _address = await _signer.getAddress();
        } catch (e) {
          set(null);
          address.set(null);
          return;
        }
        set(_signer);
        address.set(_address);
      })();
    } else {
      set(null);
      address.set(null);
    }
  }
);

export const address = writable<string | null>();

export const shortAddress = derived(address, ($address) =>
  $address ? $address.substring(0, 6) + "…" + $address.substring(38) : null
);

export const signerChainId: Readable<number | null> = derived(
  provider,
  ($provider, set) => {
    if ($provider) {
      $provider.getNetwork().then(({ chainId }) => set(chainId));
    } else {
      set(null);
    }
  }
);

export const chainId: Readable<number | null> = derived(
  providerReadOnly,
  ($provider, set) => {
    if ($provider) {
      $provider.getNetwork().then(({ chainId }) => set(chainId));
    } else {
      set(null);
    }
  }
);

export const network: Readable<string | null> = derived(
  providerReadOnly,
  ($provider, set) => {
    if ($provider) {
      $provider.getNetwork().then(({ name }) => set(name));
    } else {
      set(null);
    }
  }
);

export const balance: Readable<BigNumber | null> = derived(
  signer,
  ($signer, set) => {
    if ($signer) {
      $signer
        .getBalance()
        .then(set)
        .catch((e) => {
          console.log("Error getting balance", e);
        });
    } else {
      set(null);
    }
  }
);

export const etherscanUrl = derived(
  [chainId, network],
  ([$chainId, $network]) =>
    `https://${$chainId === 1 ? "" : $network + "."}etherscan.io`
);
