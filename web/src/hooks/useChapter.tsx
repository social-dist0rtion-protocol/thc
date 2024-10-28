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
import { useToast } from "@chakra-ui/react";

function prefixedPasswordKey(key: string) {
  return `${import.meta.env.VITE_ALCHEMY_APP_PREFIX}/${key}`;
}

function useRootCID() {
  const toast = useToast();
  const [root, setRoot] = useState("");
  const result = useReadContract({
    abi: treasureHuntCreatorAbi,
    address:
      treasureHuntCreatorAddress[
        CHAIN_ID as keyof typeof treasureHuntCreatorAddress
      ],
    functionName: "questsRootCid",
    query: {
      refetchInterval: 20000,
      refetchOnMount: true,
    },
  });

  // fix: use only sporadically, not at every mount and check when it changes
  useEffect(() => {
    if (result.data !== root) {
      if (root !== "" && root !== undefined) {
        toast({
          title: "Info",
          description: "Chapters have been updated!",
          status: "info",
          duration: 9000,
          isClosable: true,
        });
      }

      setRoot(result.data as string);
    }
  }, [result.data]);

  return root;
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
