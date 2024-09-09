import { Button, Heading, Text, Textarea, VStack } from "@chakra-ui/react";
import { useBurnerWallet } from "./BurnerWallet";
import { useState } from "react";
function Settings() {
  const { wallet, setMnemonic } = useBurnerWallet();

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
      <Text>{wallet?.address}</Text>
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
