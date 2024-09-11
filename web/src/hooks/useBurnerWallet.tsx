import { useEffect, useState } from "react";
import { MNEMONIC_KEY } from "./keys";
import { english, generateMnemonic } from "viem/accounts";
import useLocalStorage from "use-local-storage";
import { useToast } from "@chakra-ui/react";
import { HDNodeWallet, Wallet } from "ethers";

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
      setBurnerWallet(Wallet.fromPhrase(mnemonic));
    }
  }, [mnemonic]);

  return {
    burnerWallet: burnerWallet,
    mnemonic: mnemonic,
    setMnemonic: validateAndSetMnemonic,
  };
}
