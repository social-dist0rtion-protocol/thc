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
import { CHAIN_ID, GELATO_FEE_TOKEN } from "../env";
import { useInterval } from "./useInterval";

type Status = "pending" | "success" | "error";

const TOTAL_ATTEMPTS = 3;

export function useSubmitSolution(
  solution: string,
  address: `0x${string}` | undefined,
  signer: SignerOrProvider
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
  const { rounds } = useInterval(polling, 1000);

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
    if (!address) {
      throw "missing account";
    }

    const { r, s, v } = await signatureFromSolution(address, solution);
    const encodedCall = encodeFunctionData({
      args: [v, r, s],
      abi: treasureHuntCreatorAbi,
      functionName: "submit",
    });
    const response = await relayRequest(encodedCall, address, signer);
    setTaskId(response.taskId);
  }

  async function poll() {
    if (taskId) {
      const relay = new GelatoRelay();

      let taskStatus: TransactionStatusResponse | undefined;
      setAttemptsLeft(attemptsLeft - 1);
      taskStatus = await relay.getTaskStatus(taskId);
      console.log(taskStatus?.lastCheckMessage);
      setTaskStatus(taskStatus);
      handleTaskStateChange();
    }
  }

  useEffect(() => {
    if (solution !== "" && address) {
      relay();
    }
  }, [solution, address]);

  useEffect(() => {
    if (rounds === 0) {
      return;
    }

    if (rounds > TOTAL_ATTEMPTS || status !== "pending") {
      setPolling(false);
    } else if (rounds > TOTAL_ATTEMPTS || status !== "pending") {
      setPolling(false);
      setError("gelato is stuck");
    } else if (rounds <= TOTAL_ATTEMPTS && status === "pending") {
      poll();
    }
  }, [rounds]);

  useEffect(() => {
    if (taskId) {
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
  const { r, s, v } = await signatureFromSolution(address, key);
  const data = encodeFunctionData({
    args: [v, r, s],
    abi: treasureHuntCreatorAbi,
    functionName: "submit",
  });

  relayRequest(data, address, signer);
}
