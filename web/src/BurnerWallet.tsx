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
  const [wallet, setWallet] = useState<HDAccount>();

  function validateAndSetMnemonic(newMnemonic: string) {
    try {
      console.log("MADONNA PUTTANA");
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
      console.log("MADONNA BOJA");
      setWallet(mnemonicToAccount(mnemonic));
    }
  }, [mnemonic]);

  return {
    wallet: wallet,
    setMnemonic: validateAndSetMnemonic,
  };
}
