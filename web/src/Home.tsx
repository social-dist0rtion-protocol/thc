import { Button, Heading, Input, useToast, VStack } from "@chakra-ui/react";
import { useChapter } from "./hooks/useChapter";
import Markdown from "react-markdown";
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
import { signatureFromSolution } from "./hooks/utils";

function Home() {
  const {
    currentChapterIndex,
    setCurrentChapterIndex,
    setChapterPassword,
    currentChapterContent,
  } = useChapter();
  const toast = useToast();
  const account = useAccount();
  const [password, setPassword] = useState("");
  const handlePasswordChange = (event: any) => setPassword(event.target.value);

  const { data: hash, writeContract } = useWriteContract();
  const chainId = useChainId();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  async function submit(password: string) {
    const { r, s, v } = await signatureFromSolution(account.address!, password);
    writeContract({
      abi,
      address: contractAddress[chainId],
      functionName: "submit",
      args: [v, r, s],
    });
  }

  useEffect(() => {
    if (isConfirmed) {
      setCurrentChapterIndex((currentChapterIndex + 1).toString());
      setChapterPassword(password);

      toast({
        title: "Success!",
        description: "Next chapter",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [isConfirmed]);

  return (
    <VStack>
      <Heading>Home</Heading>
      <Markdown>{currentChapterContent}</Markdown>
      <Input
        value={password}
        onChange={handlePasswordChange}
        placeholder="password"
      />
      <Button isDisabled={isConfirming} onClick={() => submit(password)}>
        Submit
      </Button>
    </VStack>
  );
}

export default Home;
