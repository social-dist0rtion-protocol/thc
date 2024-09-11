import { signatureFromSolution } from "./utils";
import {
  GelatoRelay,
  SignerOrProvider,
  type CallWithSyncFeeERC2771Request,
  type TransactionStatusResponse,
} from "@gelatonetwork/relay-sdk";
import {
  treasureHuntCreatorAbi,
  treasureHuntCreatorAddress,
} from "../generated";
import { encodeFunctionData } from "viem";
import { useEffect, useState } from "react";

type Status = "pending" | "success" | "error";

const TOTAL_ATTEMPTS = 3;

export function useSubmitSolution(
  solution: string,
  address: `0x${string}`,
  chainId: 10 | 1337,
  signer: SignerOrProvider
) {
  const [status, setStatus] = useState<Status>("pending");
  const [error, setError] = useState<string>();
  const [data, setData] = useState<any>();
  const [taskStatus, setTaskStatus] = useState<
    TransactionStatusResponse | undefined
  >();
  const [taskId, setTaskId] = useState<string>();
  const [attemptsLeft, setAttemptsLeft] = useState(TOTAL_ATTEMPTS);

  async function handleTaskStateChange() {
    const taskState = taskStatus?.taskState as string;
    if (
      ["CheckPending", "ExecPending", "WaitingForConfirmation"].includes(
        taskState
      )
    ) {
      setStatus("pending");
    } else if (
      ["ExecSuccess"].includes(taskState as string) &&
      taskStatus?.transactionHash
    ) {
      setStatus("success");
      setData(taskStatus.transactionHash);
    } else if (["ExecReverted", "Cancelled"].includes(taskState)) {
      setStatus("error");
      setError(taskStatus?.lastCheckMessage);
    }
  }

  async function relay() {
    const { r, s, v } = await signatureFromSolution(address, solution);
    const encodedCall = encodeFunctionData({
      args: [v, r, s],
      abi: treasureHuntCreatorAbi,
      functionName: "submit",
    });
    const response = await relayRequest(chainId, encodedCall, address, signer);
    setTaskId(response.taskId);
  }

  async function poll() {
    if (taskId) {
      const relay = new GelatoRelay();

      let taskStatus: TransactionStatusResponse | undefined;
      setAttemptsLeft(attemptsLeft - 1);
      taskStatus = await relay.getTaskStatus(taskId);
      setTaskStatus(taskStatus);
      handleTaskStateChange();
    }
  }

  useEffect(() => {
    if (solution !== "") {
      relay();
    }
  }, [solution, address]);

  useEffect(() => {
    if (attemptsLeft >= 0 && status === "pending") {
      const intervalId = setInterval(() => {
        console.log(taskStatus?.lastCheckMessage);
        poll();
      }, 1000);

      return () => clearInterval(intervalId as unknown as number);
    }
  }, [taskId, status]);

  return {
    status,
    error,
    data,
  };
}

async function relayRequest(
  chainId: 10 | 1337,
  data: string,
  address: string,
  signer: SignerOrProvider
) {
  const relay = new GelatoRelay();
  const request: CallWithSyncFeeERC2771Request = {
    chainId: BigInt(chainId),
    target: treasureHuntCreatorAddress[chainId],
    data: data,
    user: address,
    feeToken: "0x4200000000000000000000000000000000000006", // make it chain dependent
    isRelayContext: true,
  };

  const relayResponse = await relay.callWithSyncFeeERC2771(request, signer);
  return relayResponse;
}

export async function submitKey(
  key: string,
  address: `0x${string}`,
  chainId: 10 | 1337,
  signer: SignerOrProvider
) {
  const { r, s, v } = await signatureFromSolution(address, key);
  const data = encodeFunctionData({
    args: [v, r, s],
    abi: treasureHuntCreatorAbi,
    functionName: "submit",
  });

  relayRequest(chainId, data, address, signer);
}