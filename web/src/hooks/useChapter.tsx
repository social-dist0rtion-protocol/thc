import { useEffect, useState } from "react";
import { CURRENT_CHAPTER_PASSWORD_KEY } from "./storage";
import { decrypt } from "../lib";
import { useReadContract } from "wagmi";
import {
  treasureHuntCreatorAbi,
  treasureHuntCreatorAddress,
} from "../generated";
import { CHAIN_ID } from "../env";
import { useAccount } from "./useAccount";

function prefixedPasswordKey(key: string) {
  return `${import.meta.env.VITE_ALCHEMY_APP_PREFIX}/${key}`;
}

function useRootCID() {
  const result = useReadContract({
    abi: treasureHuntCreatorAbi,
    address:
      treasureHuntCreatorAddress[
        CHAIN_ID as keyof typeof treasureHuntCreatorAddress
      ],
    functionName: "questsRootCid",
  });

  // fix: use only sporadically, not at every mount and check when it changes

  return result.data;
}

function useCurrentSmartContractChapterIndex(address?: string) {
  const [chapter, setChapter] = useState<number>();

  const result = useReadContract({
    abi: treasureHuntCreatorAbi,
    address:
      treasureHuntCreatorAddress[
        CHAIN_ID as keyof typeof treasureHuntCreatorAddress
      ],
    functionName: "playerToCurrentChapter",
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
      setChapter(Number(result.data as bigint));
      console.log(result.data);
    }
  });

  return chapter;
}

function setChapterPassword(chapterIndex: number, password: string) {
  localStorage.setItem(
    prefixedPasswordKey(`${CURRENT_CHAPTER_PASSWORD_KEY}/${chapterIndex}`),
    password
  );
}

function getChapterPassword(chapterIndex: number) {
  return (
    localStorage.getItem(
      prefixedPasswordKey(`${CURRENT_CHAPTER_PASSWORD_KEY}/${chapterIndex}`)
    ) || ""
  );
}

export function useChapter() {
  const account = useAccount();
  const [currentChapterContent, setCurrentChapterContent] =
    useState<string>("");
  const rootCID = useRootCID();
  const currentSmartContractChapterIndex = useCurrentSmartContractChapterIndex(
    account?.address
  );

  async function updateChapterContent(chapter: number) {
    const response = await fetch(`game-data/${rootCID}/${chapter}`);
    const data = await response.text();
    console.log(currentSmartContractChapterIndex);
    if (chapter > 0) {
      const chapterPassword = getChapterPassword(chapter - 1);
      const text = await decrypt(data, chapterPassword);
      setCurrentChapterContent(text);
    } else {
      setCurrentChapterContent(data);
    }
  }

  useEffect(() => {
    if (
      rootCID === undefined ||
      currentSmartContractChapterIndex === undefined
    ) {
      return;
    }
    updateChapterContent(currentSmartContractChapterIndex);
  }, [rootCID, currentSmartContractChapterIndex]);

  return {
    currentSmartContractChapterIndex,
    setChapterPassword,
    currentChapterContent,
  };
}
