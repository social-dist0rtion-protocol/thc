import { Button, Heading, Input, useToast, VStack } from "@chakra-ui/react";
import { useChapter } from "./hooks/useChapter";
import Markdown from "react-markdown";
import { useEffect, useRef, useState } from "react";
import { useSubmitSolution } from "./hooks/gelato";
import { useAccount } from "./hooks/useAccount";
import { addressFromSolution } from "./lib";
import metadata from "./metadata.json";
import { useLocalStorage } from "@uidotdev/usehooks";

function Home() {
  const {
    currentSmartContractChapterIndex,
    setChapterPassword,
    currentChapterContent,
  } = useChapter();
  const toast = useToast();
  const account = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useLocalStorage("password", "");
  const [currentChapter, setCurrentChapter] = useState<number | undefined>();
  const { status: gelatoStatus, error: gelatoError } = useSubmitSolution(
    password,
    account?.address as `0x${string}`,
    account,
    currentChapter
  );

  useEffect(() => {
    if (gelatoStatus === "error") {
      toast({
        title: "Error",
        description: `An error occurred: ${gelatoError}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setPassword("");
    }
  }, [gelatoStatus]);

  useEffect(() => {
    if (
      currentSmartContractChapterIndex !== undefined &&
      currentSmartContractChapterIndex !== currentChapter
    ) {
      if (password !== "" && currentChapter != undefined) {
        toast({
          title: "Success!",
          description: `Transaction finalized. You advanced to chapter ${currentSmartContractChapterIndex}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setPassword("");
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
      setCurrentChapter(currentSmartContractChapterIndex);
    }
  }, [currentSmartContractChapterIndex]);

  function submitPassword() {
    if (!account) {
      toast({
        title: "Error",
        description: "Account not available",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else if (
      currentSmartContractChapterIndex !== undefined &&
      inputRef.current !== null
    ) {
      const inputPassword = inputRef.current.value;
      if (
        addressFromSolution(inputPassword) !==
        metadata.chapters[currentSmartContractChapterIndex]
      ) {
        toast({
          title: "Error",
          description: "Wrong solution",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Correct!",
          description:
            "Correct solution. Waiting for the transaction to be finalized...",
          status: "info",
          duration: 9000,
          isClosable: true,
        });

        setChapterPassword(currentSmartContractChapterIndex, inputPassword);
        setPassword(inputPassword);
      }
    }
  }

  return (
    <VStack className="content-pane" align="flex-start">
      <Heading>Home</Heading>
      <Heading variant="h2">Chapter {currentSmartContractChapterIndex}</Heading>
      <Markdown>{currentChapterContent}</Markdown>
      <Input ref={inputRef} placeholder="password" />
      <Button
        isDisabled={gelatoStatus === "pending"}
        onClick={() => submitPassword()}
      >
        Submit
      </Button>
    </VStack>
  );
}

export default Home;
