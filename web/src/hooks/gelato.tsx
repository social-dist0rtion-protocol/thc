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
import { CONTRACT_ADDRESS, CHAIN_ID, GELATO_FEE_TOKEN } from "../env";
import { useInterval } from "./useInterval";
import { useLocalStorage } from "@uidotdev/usehooks";

type Status = "pending" | "success" | "error";

const TOTAL_ATTEMPTS = 10;

export function useSubmitSolution(
  solution: string,
  address: `0x${string}` | undefined,
  signer: SignerOrProvider | undefined,
  index: number | undefined,
  submitFunctionName: "submit" | "submitKey"
) {
  const [error, setError] = useState<string>();
  const [data, setData] = useState<any>();
  const [taskStatus, setTaskStatus] = useLocalStorage<
    TransactionStatusResponse | undefined
  >(
    `${CONTRACT_ADDRESS}/taskStatus/${submitFunctionName}/${(index !== undefined
      ? index.toString()
      : "unknown"
    ).toString()}`
  );
  const [taskId, setTaskId] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>();
  const [polling, setPolling] = useState(false);
  const { rounds } = useInterval(polling, 4000);

  function handleTaskStateChange() {
    const taskState = taskStatus?.taskState as string;
    console.log("Task state change", taskStatus);
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
      finalize("success", { data: taskStatus?.transactionHash });
    } else if (["ExecReverted", "Cancelled"].includes(taskState)) {
      finalize("error", { error: taskStatus?.lastCheckMessage });
    }
  }

  async function relay() {
    console.log("Relay", solution);
    if (!address || !signer) {
      throw "missing account";
    }

    const { r, s, v } = await signatureFromSolution(solution, address);
    const encodedCall = encodeFunctionData({
      args: [Number(v), r, s],
      abi: treasureHuntCreatorAbi,
      functionName: submitFunctionName,
    });

    try {
      const response = await relayRequest(encodedCall, address, signer);
      setStatus("pending");
      setTaskId(response.taskId);
      await fetchTaskStatus(response.taskId);
    } catch (e) {
      finalize("error", { error: "cannot relay. check your connection" });
    }
  }

  async function poll() {
    if (taskStatus && polling) {
      await fetchTaskStatus(taskStatus.taskId);
    }
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fetchTaskStatus(taskId: string) {
    const relay = new GelatoRelay();
    let taskStatus: TransactionStatusResponse | undefined;
    let retries = 10;
    while (retries > 0) {
      try {
        taskStatus = await relay.getTaskStatus(taskId);
        setTaskStatus(taskStatus);
        break;
      } catch (e: any) {
        await sleep(1000);
        retries--;
      }
    }

    if (retries === 0) {
      finalize("error", {
        error: "error fetching status. check your connection",
      });
    }
  }

  function finalize(
    status: Status | undefined,
    info?: { data?: string; error?: string }
  ) {
    console.log("Finalize task status", status);
    setStatus(status);
    setError(info?.error);
    setData(info?.data);
    setPolling(false);
    if (status == "error" || submitFunctionName === "submitKey") {
      setTaskStatus(undefined);
    }
  }

  useEffect(() => {
    if (
      solution !== "" &&
      address &&
      signer &&
      !taskStatus &&
      index !== undefined
    ) {
      console.log("relaying");
      relay();
    }
  }, [solution, address, signer, index]);

  useEffect(() => {
    if (taskStatus) {
      setTaskId(taskStatus.taskId);
      handleTaskStateChange();
    } else {
      setTaskId(undefined);
    }
  }, [taskStatus]);

  useEffect(() => {
    if (!taskId) {
      setStatus(undefined);
      setPolling(false);
    } else {
      poll();
      setPolling(true);
    }
  }, [taskId]);

  useEffect(() => {
    if (rounds === 0) {
      return;
    }

    if (rounds > TOTAL_ATTEMPTS) {
      finalize("error", { error: "too many failed attempt with gelato" });
    } else {
      poll();
    }
  }, [rounds]);

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
    args: [Number(v), r, s],
    abi: treasureHuntCreatorAbi,
    functionName: "submit",
  });

  relayRequest(data, address, signer);
}
