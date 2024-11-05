import { Button, Input, useToast, VStack } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useSubmitSolution } from "./hooks/gelato";
import { useAccount } from "./hooks/useAccount";
import { useLocalStorage } from "@uidotdev/usehooks";

type PuzzleProps = {
  index: number | undefined;
  setPasswordAtIndex: (index: number, password: string) => void;
  solutionMatcher: (solution: string) => boolean;
  submitFunctionName: "submit" | "submitKey";
  children: ReactNode;
  isLast: boolean;
};

function Puzzle(props: PuzzleProps) {
  const toast = useToast();
  const account = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useLocalStorage("password", "");
  const [currentChapter, setCurrentChapter] = useState<number | undefined>();
  const { status: gelatoStatus, error: gelatoError } = useSubmitSolution(
    password,
    account?.address as `0x${string}`,
    account,
    currentChapter,
    props.submitFunctionName
  );

  useEffect(() => {
    console.log(gelatoStatus);
    if (gelatoStatus === "error") {
      toast.closeAll();
      toast({
        title: "Error",
        description: `An error occurred: ${gelatoError}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setPassword("");
    } else if (gelatoStatus === "pending") {
      toast({
        title: "Waiting...",
        description: `Transaction is being finalized`,
        status: "info",
        duration: null,
        isClosable: true,
      });
    } else if (gelatoStatus === "success") {
      toast.closeAll();
      toast({
        title: "Success!",
        description: `Transaction finalized. Congrats!`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [gelatoStatus]);

  useEffect(() => {
    if (props.index !== undefined && props.index !== currentChapter) {
      if (password !== "" && currentChapter != undefined) {
        toast.closeAll();
        toast({
          title: "Success!",
          description: `Transaction finalized. Congrats!`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setPassword("");
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
      setCurrentChapter(props.index);
    }
  }, [props.index]);

  function submitPassword() {
    if (!account) {
      toast({
        title: "Error",
        description: "Account not available",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else if (props.index !== undefined && inputRef.current !== null) {
      const inputPassword = inputRef.current.value;
      if (!props.solutionMatcher(inputPassword)) {
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
          description: "Correct solution!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        props.setPasswordAtIndex(props.index, inputPassword);
        setPassword(inputPassword);
      }
    }
  }

  return (
    <VStack align="flex-start">
      {props.children}
      {!props.isLast && (
        <>
          <Input ref={inputRef} placeholder="password" />
          <Button
            isDisabled={gelatoStatus === "pending"}
            onClick={() => submitPassword()}
          >
            Submit
          </Button>
        </>
      )}
    </VStack>
  );
}

export default Puzzle;
