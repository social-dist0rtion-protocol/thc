import { useEffect, useState } from "react";
import { CURRENT_CHAPTER_PASSWORD_KEY, ROOT_HASH_KEY } from "./storage";
import { decrypt } from "../lib";
import { useReadContract } from "wagmi";
import { treasureHuntCreatorAbi } from "../generated";
import { CONTRACT_ADDRESS } from "../env";
import { useToast } from "@chakra-ui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useBurnerWallet } from "./useBurnerWallet";

function prefixedPasswordKey(key: string) {
  return `${CONTRACT_ADDRESS}/${key}`;
}

function useRootCID() {
  const toast = useToast();
  const [root, setRoot] = useLocalStorage(ROOT_HASH_KEY, "");
  const [newestRootHash, setNewestRootHash] = useState<string>();

  const result = useReadContract({
    abi: treasureHuntCreatorAbi,
    address: CONTRACT_ADDRESS,
    functionName: "questsRootCid",
    query: {
      refetchInterval: 20000,
      refetchOnMount: true,
    },
  });

  async function updateIfAvailable() {
    if (newestRootHash !== undefined && newestRootHash !== root) {
      const nwestContent = await fetch(`game-data/${newestRootHash}/0`);
      const data = await nwestContent.text();
      if (data.indexOf("<html") === -1) {
        setRoot(newestRootHash);
        toast({
          title: "Info",
          description: "Chapters have been updated!",
          status: "info",
          duration: 9000,
          isClosable: true,
        });
      } else {
        // try next round
        setNewestRootHash(undefined);
      }
    }
  }

  useEffect(() => {
    if (result.data !== undefined) {
      setNewestRootHash(result.data as string);
    }
  }, [result.data]);

  useEffect(() => {
    updateIfAvailable();
  }, [newestRootHash]);

  return root;
}

function useCurrentSmartContractChapterIndex(address?: string) {
  const [chapter, setChapter] = useState<number | undefined>();

  const result = useReadContract({
    abi: treasureHuntCreatorAbi,
    address: CONTRACT_ADDRESS,
    functionName: "playerToCurrentChapter",
    args: [address as `0x${string}`],
    query: {
      enabled: address !== undefined,
      refetchInterval: 10000,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  });

  // fix: use only sporadically, not at every mount and check when it changes

  useEffect(() => {
    if (result.data !== undefined) {
      setChapter(Number(result.data));
    }
  });

  return chapter;
}

function getPreviousPasswordKey(chapter: number | undefined) {
  return chapter !== undefined && chapter > 0
    ? prefixedPasswordKey(`${CURRENT_CHAPTER_PASSWORD_KEY}/${chapter - 1}`)
    : "";
}

export function useChapter() {
  const { burnerWallet: account } = useBurnerWallet();
  const [currentChapterContent, setCurrentChapterContent] =
    useState<string>("");
  const rootCID = useRootCID();
  const currentSmartContractChapterIndex = useCurrentSmartContractChapterIndex(
    account?.address
  );
  const [isLast, setIsLast] = useState(false);
  const [previousChapterPassword] = useLocalStorage<string>(
    getPreviousPasswordKey(currentSmartContractChapterIndex)
  );
  const [chapterPassword, setChapterPassword] = useLocalStorage(
    prefixedPasswordKey(
      `${CURRENT_CHAPTER_PASSWORD_KEY}/${currentSmartContractChapterIndex}`
    ),
    ""
  );

  async function updateChapterContent() {
    if (
      currentSmartContractChapterIndex !== undefined &&
      currentSmartContractChapterIndex > 0
    ) {
      const response = await fetch(
        `game-data/${rootCID}/${currentSmartContractChapterIndex}`
      );
      const data = await response.text();
      const text = await decrypt(data, previousChapterPassword);
      setCurrentChapterContent(text);

      try {
        const nextResult = await fetch(
          `game-data/${rootCID}/${currentSmartContractChapterIndex + 1}`
        );
        const data = await nextResult.text();
        setIsLast(data.indexOf("<html") !== -1);
      } catch (e) {
        setIsLast(true);
      }
    } else {
      const response = await fetch(`game-data/${rootCID}/0`);
      const data = await response.text();
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
    updateChapterContent();
  }, [rootCID, currentSmartContractChapterIndex]);

  return {
    currentSmartContractChapterIndex,
    chapterPassword,
    setChapterPassword,
    currentChapterContent,
    isLast,
  };
}
