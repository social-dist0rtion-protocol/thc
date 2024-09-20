import { useEffect, useState } from "react";
import { MNEMONIC_KEY } from "./storage";
import { english, generateMnemonic } from "viem/accounts";
import useLocalStorage from "use-local-storage";
import { useToast } from "@chakra-ui/react";
import { HDNodeWallet, JsonRpcProvider, Wallet } from "ethers";
import { RPC_NODE_URL } from "../env";

export function useBurnerWallet() {
  const toast = useToast();
  const [mnemonic, setMnemonic] = useLocalStorage(MNEMONIC_KEY, "");
  const [burnerWallet, setBurnerWallet] = useState<HDNodeWallet>();

  function validateAndSetMnemonic(newMnemonic: string) {
    try {
      Wallet.fromPhrase(newMnemonic);
      setMnemonic(newMnemonic);
    } catch (e: any) {
      toast({
        title: "Invalid Seed Phrase.",
        description:
          "The seed phrase you typed is not a valid BIP39 english mnemonic",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    if (mnemonic === "") {
      validateAndSetMnemonic(generateMnemonic(english));
    } else {
      const wallet = Wallet.fromPhrase(mnemonic).connect(
        new JsonRpcProvider(RPC_NODE_URL)
      );
      setBurnerWallet(wallet);
    }
  }, [mnemonic]);

  return {
    burnerWallet: burnerWallet,
    mnemonic: mnemonic,
    setMnemonic: validateAndSetMnemonic,
    resetMnemonic: () => setMnemonic(""),
  };
}
