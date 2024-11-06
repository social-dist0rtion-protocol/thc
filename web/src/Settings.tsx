import {
  Button,
  Heading,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useBurnerWallet } from "./hooks/useBurnerWallet";
import { dump, restore } from "./hooks/storage";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { CONTRACT_ADDRESS } from "./env";

function Settings() {
  const {
    burnerWallet: wallet,
    mnemonic,
    setMnemonic,
    resetMnemonic,
  } = useBurnerWallet();

  const toast = useToast();

  let [temporaryMnemonic, setTemporaryMnemonic] = useState(mnemonic || "");
  let [temporaryDump, setTemporaryDump] = useState(dump());

  let handleInputChange = (e: any) => {
    let inputValue = e.target.value;
    setTemporaryMnemonic(inputValue);
  };

  let handleDumpChange = (e: any) => {
    let inputValue = e.target.value;
    setTemporaryDump(inputValue);
  };

  function reset() {
    localStorage.clear();
    resetMnemonic();
  }

  function restoreFromDump() {
    if (temporaryDump !== "") {
      restore(temporaryDump);
      toast({
        title: "Success!",
        description: `You restored your game!`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "No dump",
        description: `There is not dump in the text area`,
        status: "info",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    if (mnemonic !== "") setTemporaryMnemonic(mnemonic);

    setTemporaryDump(dump());
  }, [mnemonic]);

  return (
    <VStack alignItems="flex-start">
      <Heading marginBottom="40px">Settings</Heading>
      <Heading variant="h2">Wallet Address</Heading>
      <Text>You are connected with the burner wallet</Text>
      <Text whiteSpace="normal" wordBreak="break-all">
        {wallet?.address}
      </Text>
      {wallet !== undefined && <QRCode value={wallet?.address} />}
      {/*
      account.isConnected ? (
        <ConnectButton label="use burner wallet" />
      ) : (
        <ConnectButton label="connect injected wallet" />
      )
      */}
      <Heading variant="h2" marginTop="40px">
        Network
      </Heading>
      <Text>Optimism</Text>
      <Heading variant="h2" marginTop="40px">
        Smart Contract
      </Heading>
      <Text whiteSpace="normal" wordBreak="break-all">
        {CONTRACT_ADDRESS}
      </Text>
      <Heading variant="h2" marginTop="40px">
        Change Seedphrase
      </Heading>
      <Text fontWeight="bold">Mnemonic</Text>
      <Textarea
        value={temporaryMnemonic}
        isInvalid={temporaryMnemonic === ""}
        onChange={handleInputChange}
        placeholder="Your seedphrase"
      ></Textarea>
      <Button onClick={() => setMnemonic(temporaryMnemonic)}>Change</Button>
      <Heading variant="h2" marginTop="40px">
        Reset Game
      </Heading>
      <Text>
        Reset the current session, you'll start from Chapter 0 again. You should
        make a backup first.
      </Text>
      <Textarea
        value={temporaryDump}
        onChange={handleDumpChange}
        placeholder="Your dump"
      ></Textarea>
      <Button onClick={() => reset()}>Reset Game</Button>
      <Heading variant="h2" marginTop="40px">
        Restore
      </Heading>
      <Text>Restore the game providing a dump</Text>
      <Textarea
        value={temporaryDump}
        onChange={handleDumpChange}
        placeholder="Your dump"
      ></Textarea>
      <Button onClick={() => restoreFromDump()}>Restore from dump</Button>
    </VStack>
  );
}

export default Settings;
