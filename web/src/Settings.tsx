import { Button, Heading, Text, Textarea, VStack } from "@chakra-ui/react";
import { useBurnerWallet } from "./hooks/useBurnerWallet";
import { useState } from "react";
import QRCode from "react-qr-code";
import { treasureHuntCreatorAddress } from "./generated";
import { CHAIN_ID } from "./env";

function Settings() {
  const {
    burnerWallet: wallet,
    mnemonic,
    setMnemonic,
    resetMnemonic,
  } = useBurnerWallet();

  let [temporaryMnemonic, setTemporaryMnemonic] = useState(mnemonic || "");

  let handleInputChange = (e: any) => {
    let inputValue = e.target.value;
    setTemporaryMnemonic(inputValue);
  };

  function reset() {
    resetMnemonic();
    setTemporaryMnemonic(mnemonic);
  }

  return (
    <VStack alignItems="flex-start">
      <Heading marginBottom="40px">Settings</Heading>
      <Heading variant="h2">Wallet Address</Heading>
      <Text>You are connected with the burner wallet</Text>
      <Text>{wallet?.address}</Text>
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
      <Text>
        {
          treasureHuntCreatorAddress[
            CHAIN_ID as keyof typeof treasureHuntCreatorAddress
          ]
        }
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
      <Text>Reset the current session, you'll start from Chapter 0 again</Text>
      <Button onClick={() => reset()}>Reset Game</Button>
    </VStack>
  );
}

export default Settings;
