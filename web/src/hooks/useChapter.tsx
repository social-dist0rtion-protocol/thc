import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import {
  CURRENT_CHAPTER_INDEX_KEY,
  CURRENT_CHAPTER_PASSWORD_KEY,
} from "./keys";
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
  const [chapter, setChapter] = useState(0);

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
    if (result.data) {
      setChapter(Number(result.data as bigint));
      console.log(result.data);
    }
  });

  return chapter;
}

function useCurrentChapterIndex() {
  const [currentChapter, setCurrentChapterIndex] = useLocalStorage(
    prefixedPasswordKey(CURRENT_CHAPTER_INDEX_KEY),
    "0"
  );
  return {
    currentChapterIndex: parseInt(currentChapter),
    setCurrentChapterIndex,
  };
}

function useChapterPassword(chapterIndex: number) {
  const [chapterPassword, setChapterPassword] = useLocalStorage(
    prefixedPasswordKey(`${CURRENT_CHAPTER_PASSWORD_KEY}/${chapterIndex}`),
    ""
  );
  return { chapterPassword, setChapterPassword };
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
  //const { currentChapterIndex, setCurrentChapterIndex } =
  //  useCurrentChapterIndex();
  const currentSmartContractChapterIndex = useCurrentSmartContractChapterIndex(
    account?.address
  );

  useEffect(() => {
    if (rootCID === undefined) {
      return;
    }

    fetch(`game-data/${rootCID}/${currentSmartContractChapterIndex}`)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        if (currentSmartContractChapterIndex > 0) {
          const chapterPassword = getChapterPassword(
            currentSmartContractChapterIndex - 1
          );
          decrypt(data, chapterPassword).then((text: string) => {
            console.log(text);
            setCurrentChapterContent(text);
          });
        } else {
          setCurrentChapterContent(data);
        }
      });
  }, [rootCID, currentSmartContractChapterIndex]);

  return {
    currentSmartContractChapterIndex,
    setChapterPassword,
    currentChapterContent,
  };
}
