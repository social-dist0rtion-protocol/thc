import { useEffect, useState } from "react";
import { MNEMONIC_KEY } from "./keys";
import {
  english,
  generateMnemonic,
  HDAccount,
  mnemonicToAccount,
} from "viem/accounts";
import useLocalStorage from "use-local-storage";
import { useToast } from "@chakra-ui/react";

export function useBurnerWallet() {
  const toast = useToast();
  const [mnemonic, setMnemonic] = useLocalStorage(MNEMONIC_KEY, "");
  const [burnerWallet, setBurnerWallet] = useState<HDAccount>();

  function validateAndSetMnemonic(newMnemonic: string) {
    try {
      mnemonicToAccount(newMnemonic);
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
      setBurnerWallet(mnemonicToAccount(mnemonic));
    }
  }, [mnemonic]);

  return {
    burnerWallet: burnerWallet,
    mnemonic: mnemonic,
    setMnemonic: validateAndSetMnemonic,
  };
}
