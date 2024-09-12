import { Button, Heading, Text, Textarea, VStack } from "@chakra-ui/react";
import { useBurnerWallet } from "./hooks/useBurnerWallet";
import { useState } from "react";
function Settings() {
  const { burnerWallet: wallet, mnemonic, setMnemonic } = useBurnerWallet();

  let [temporaryMnemonic, setTemporaryMnemonic] = useState(mnemonic || "");

  let handleInputChange = (e: any) => {
    let inputValue = e.target.value;
    setTemporaryMnemonic(inputValue);
  };

  return (
    <VStack alignItems="flex-start">
      <Heading as="h1" size="xxl">
        Settings
      </Heading>
      <Heading as="h2" size="xl">
        Wallet Address
      </Heading>
      <Text>You are connected with the burner wallet</Text>
      <Text>{wallet?.address}</Text>
      {/*
      account.isConnected ? (
        <ConnectButton label="use burner wallet" />
      ) : (
        <ConnectButton label="connect injected wallet" />
      )
      */}
      <Heading as="h2" size="xl">
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
    </VStack>
  );
}

export default Settings;
