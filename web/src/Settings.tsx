import { Button, Heading, Text, Textarea, VStack } from "@chakra-ui/react";
import { useBurnerWallet } from "./hooks/useBurnerWallet";
import { useState } from "react";
import ConnectButton from "./ConnectButton";
import { useAccount } from "wagmi";
function Settings() {
  const { burnerWallet: wallet, setMnemonic } = useBurnerWallet();
  const account = useAccount();

  let [temporaryMnemonic, setTemporaryMnemonic] = useState("");

  let handleInputChange = (e: any) => {
    let inputValue = e.target.value;
    setTemporaryMnemonic(inputValue);
  };

  return (
    <VStack>
      <Heading as="h1" size="xxl">
        Settings
      </Heading>
      <Heading as="h2" size="xl">
        Wallet Address
      </Heading>
      <Text>
        You are connected with the{" "}
        {account.isConnected ? "injected wallet" : "burner wallet"}
      </Text>
      <Text>{account.isConnected ? account.address : wallet?.address}</Text>
      {account.isConnected ? (
        <ConnectButton label="use burner wallet" />
      ) : (
        <ConnectButton label="connect injected wallet" />
      )}
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
