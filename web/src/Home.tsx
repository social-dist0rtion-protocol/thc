import { Button, Heading, Input, useToast, VStack } from "@chakra-ui/react";
import { useChapter } from "./hooks/useChapter";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import { useSubmitSolution } from "./hooks/gelato";
import { useAccount } from "./hooks/useAccount";

function Home() {
  const {
    currentChapterIndex,
    setCurrentChapterIndex,
    setChapterPassword,
    currentChapterContent,
  } = useChapter();
  const toast = useToast();
  const account = useAccount();
  const [inputField, setInputField] = useState("");
  const [password, setPassword] = useState("");
  const {
    status: gelatoStatus,
    data: gelatoData,
    error: gelatoError,
  } = useSubmitSolution(password, account!.address as `0x${string}`, account!);

  const handlePasswordChange = (event: any) =>
    setInputField(event.target.value);

  useEffect(() => {
    if (gelatoStatus === "success") {
      setCurrentChapterIndex((currentChapterIndex + 1).toString());
      setChapterPassword(password);

      toast({
        title: "Success!",
        description: "Next chapter",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
    if (gelatoStatus === "error") {
      toast({
        title: "Error",
        description: `An error occurred: ${gelatoError}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [gelatoStatus]);

  function submitPassword() {
    if (!account) {
      toast({
        title: "Error",
        description: "Account not available",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setPassword(inputField);
    }
  }

  return (
    <VStack className="content-pane" align="flex-start">
      <Heading>Home</Heading>
      <Markdown>{currentChapterContent}</Markdown>
      <Input
        value={inputField}
        onChange={handlePasswordChange}
        placeholder="password"
      />
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
