import {
  Button,
  Heading,
  Input,
  Link,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  treasureHuntCreatorAbi as abi,
  treasureHuntCreatorAddress as contractAddress,
} from "./generated";
import { signatureFromSolution } from "./lib";

function SideQuests() {
  const toast = useToast();
  const account = useAccount();
  const [password, setPassword] = useState("");
  const handlePasswordChange = (event: any) => setPassword(event.target.value);

  const { data: hash, writeContract, status, error } = useWriteContract();
  const chainId = useChainId();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  async function submitKey(password: string) {
    const { r, s, v } = await signatureFromSolution(account.address!, password);
    writeContract({
      abi,
      address: contractAddress[chainId],
      functionName: "submitKey",
      args: [v, r, s],
    });
  }

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Success!",
        description: "You found a key!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (status === "error") {
      toast({
        title: "Error",
        description: "Wrong key",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [status]);

  return (
    <VStack className="content-pane" align="flex-start">
      <Heading>Side Quests</Heading>
      <Text>
        Did you find a side quest? Submit the password with this form to add it
        to your score in the leaderboard. More info in the{" "}
        <Link href="/#faq">FAQs</Link>.
      </Text>
      <Input
        value={password}
        onChange={handlePasswordChange}
        placeholder="password"
      />
      <Button isDisabled={isConfirming} onClick={() => submitKey(password)}>
        Submit
      </Button>
    </VStack>
  );
}

export default SideQuests;
