import { signatureFromSolution } from "../lib";
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
import { CHAIN_ID, GELATO_FEE_TOKEN } from "../env";
import { useInterval } from "./useInterval";

type Status = "pending" | "success" | "error";

const TOTAL_ATTEMPTS = 10;

export function useSubmitSolution(
  solution: string,
  address: `0x${string}` | undefined,
  signer: SignerOrProvider | undefined
) {
  const [status, setStatus] = useState<Status>();
  const [error, setError] = useState<string>();
  const [data, setData] = useState<any>();
  const [taskStatus, setTaskStatus] = useState<
    TransactionStatusResponse | undefined
  >();
  const [taskId, setTaskId] = useState<string>();
  const [attemptsLeft, setAttemptsLeft] = useState(TOTAL_ATTEMPTS);

  const [polling, setPolling] = useState(false);
  const { rounds } = useInterval(polling, 4000);

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
    console.log("relay");
    if (!address || !signer) {
      throw "missing account";
    }

    const { r, s, v } = await signatureFromSolution(solution, address);
    console.log(`Solution ${solution}, address ${address}`);
    const encodedCall = encodeFunctionData({
      args: [v, r, s],
      abi: treasureHuntCreatorAbi,
      functionName: "submit",
    });

    setStatus("pending");
    const response = await relayRequest(encodedCall, address, signer);
    console.log(response);
    await fetchTaskStatus(response.taskId);
    setTaskId(response.taskId);
  }

  async function poll() {
    if (taskId && polling) {
      console.log("poll");
      setAttemptsLeft(attemptsLeft - 1);
      await fetchTaskStatus(taskId);
      handleTaskStateChange();
    }
  }

  async function fetchTaskStatus(taskId: string) {
    const relay = new GelatoRelay();
    let taskStatus: TransactionStatusResponse | undefined;
    let retries = 3;
    while (retries > 0) {
      try {
        taskStatus = await relay.getTaskStatus(taskId);
        console.log(taskStatus);
        setTaskStatus(taskStatus);
        return;
      } catch (e: any) {
        console.log(e);
        retries--;
      }
    }

    if (retries === 0) {
      setStatus("error");
      setError("error fetching status");
    }
  }

  useEffect(() => {
    if (solution !== "" && address && signer) {
      console.log("relay");
      console.log(solution);
      relay();
    }
  }, [solution, address]);

  useEffect(() => {
    console.log(rounds);
    if (rounds === 0) {
      return;
    }
    console.log(status);
    if (status !== "pending") {
      setPolling(false);
      console.log("error, other errors");
    } else if (rounds > TOTAL_ATTEMPTS) {
      console.log("error, gelato stuck");
      setPolling(false);
      setStatus("error");
      setError("gelato is stuck");
    } else {
      console.log("polling");
      poll();
    }
  }, [rounds]);

  useEffect(() => {
    if (taskId) {
      handleTaskStateChange();
      setPolling(true);
    }
  }, [taskId]);

  return {
    status,
    error,
    data,
  };
}

async function relayRequest(
  data: string,
  address: string,
  signer: SignerOrProvider
) {
  const relay = new GelatoRelay();
  const request: CallWithSyncFeeERC2771Request = {
    chainId: BigInt(CHAIN_ID),
    target:
      treasureHuntCreatorAddress[
        CHAIN_ID as keyof typeof treasureHuntCreatorAddress
      ],
    data: data,
    user: address,
    feeToken: GELATO_FEE_TOKEN, // make it chain dependent
    isRelayContext: true,
  };

  const relayResponse = await relay.callWithSyncFeeERC2771(request, signer);
  return relayResponse;
}

export async function submitKey(
  key: string,
  address: `0x${string}`,
  signer: SignerOrProvider
) {
  const { r, s, v } = await signatureFromSolution(key, address);
  const data = encodeFunctionData({
    args: [v, r, s],
    abi: treasureHuntCreatorAbi,
    functionName: "submit",
  });

  relayRequest(data, address, signer);
}
