import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import {
  treasureHuntCreatorAbi,
  treasureHuntCreatorAddress,
} from "../generated";
import { CHAIN_ID } from "../env";
import { useAccount } from "./useAccount";

function useCurrentSmartContractSideQuestIndex(address?: string) {
  const [sideQuest, setSideQuest] = useState<number>();

  const result = useReadContract({
    abi: treasureHuntCreatorAbi,
    address:
      treasureHuntCreatorAddress[
        CHAIN_ID as keyof typeof treasureHuntCreatorAddress
      ],
    functionName: "playerToKeys",
    args: [address as `0x${string}`],
    query: {
      enabled: address !== undefined,
      refetchInterval: 5000,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  });

  // fix: use only sporadically, not at every mount and check when it changes

  useEffect(() => {
    if (result.data !== undefined) {
      const bitmap = result.data as bigint;
      const solvedKeys = bitmap
        .toString(2)
        .split("")
        .filter((k) => k === "1").length;
      setSideQuest(solvedKeys);
      console.log(solvedKeys);
    }
  });

  return sideQuest;
}

export function useSideQuest() {
  const account = useAccount();
  const currentSmartContractSideQuestIndex =
    useCurrentSmartContractSideQuestIndex(account?.address);

  return {
    currentSmartContractSideQuestIndex,
  };
}
