import { Button, Input, ToastId, useToast, VStack } from "@chakra-ui/react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSubmitSolution } from "./hooks/gelato";
import { useAccount } from "./hooks/useAccount";

type PuzzleProps = {
  index: number | undefined;
  setPassword: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  password: string;
  solutionMatcher: (solution: string) => boolean;
  submitFunctionName: "submit" | "submitKey";
  children: ReactNode;
  isLast: boolean;
};

function Puzzle(props: PuzzleProps) {
  const toast = useToast();
  const toastIdRef = useRef<ToastId>();
  const account = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);

  const [currentChapter, setCurrentChapter] = useState<number | undefined>();
  const { status: gelatoStatus, error: gelatoError } = useSubmitSolution(
    props.password,
    account?.address as `0x${string}`,
    account,
    currentChapter,
    props.submitFunctionName
  );

  const transactionSuccessMessage =
    props.submitFunctionName === "submit"
      ? "Transaction for chapter finalized!"
      : "Transaction for side quest finalized!";

  const transactionPendingMessage =
    props.submitFunctionName === "submit"
      ? "Pending transaction for chapter..."
      : "Pending transaction for side-quest";

  useEffect(() => {
    return () => {
      toast.closeAll();
    };
  }, []); // Empty dependency array ensures it only runs on mount/unmount

  useEffect(() => {
    if (gelatoStatus !== undefined && toastIdRef.current !== undefined) {
      toast.close(toastIdRef.current);
    }

    if (gelatoStatus === "error") {
      toast({
        title: "Error",
        description: `An error occurred: ${gelatoError}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      props.setPassword("");
      props.setIsLoading(false);
    } else if (gelatoStatus === "pending") {
      toastIdRef.current = toast({
        title: "Waiting...",
        description: transactionPendingMessage,
        status: "info",
        duration: null,
        isClosable: true,
      });
      props.setIsLoading(true);
    } else if (gelatoStatus === "success") {
      toast({
        title: "Success!",
        description: transactionSuccessMessage,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [gelatoStatus]);

  useEffect(() => {
    if (props.index !== undefined && props.index !== currentChapter) {
      if (toastIdRef.current !== undefined) {
        toast.close(toastIdRef.current);
      }
      if (currentChapter !== undefined) {
        toast({
          title: "Success!",
          description: transactionSuccessMessage,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
      props.setIsLoading(false);
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
        props.setPassword(inputPassword);
      }
    }
  }

  return (
    <VStack align="flex-start">
      {props.children}
      {!props.isLast && (
        <>
          <Input ref={inputRef} placeholder="password" />
          <Button isDisabled={props.isLoading} onClick={() => submitPassword()}>
            Submit
          </Button>
        </>
      )}
    </VStack>
  );
}

export default Puzzle;
