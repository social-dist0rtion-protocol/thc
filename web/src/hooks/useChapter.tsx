import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import {
  CURRENT_CHAPTER_INDEX_KEY,
  CURRENT_CHAPTER_PASSWORD_KEY,
} from "./keys";
import { decryptText } from "../lib";

function prefixedPasswordKey(key: string) {
  return `${import.meta.env.VITE_ALCHEMY_APP_PREFIX}/${key}`;
}

function useRootCID() {
  return "0x3209943bebf1c75d47028c740c59cc929eef963fd133fcff0bdb6ef80bc31306";
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

export function useChapter() {
  const [currentChapterContent, setCurrentChapterContent] =
    useState<string>("");
  const rootCID = useRootCID();
  const { currentChapterIndex, setCurrentChapterIndex } =
    useCurrentChapterIndex();
  const { chapterPassword, setChapterPassword } =
    useChapterPassword(currentChapterIndex);

  useEffect(() => {
    fetch(`game-data/${rootCID}/${currentChapterIndex}`)
      .then((response) => response.text())
      .then((data) => {
        if (chapterPassword !== "") {
          decryptText(data, chapterPassword as unknown as CryptoKey).then(
            (text) => setCurrentChapterContent(text)
          );
        } else {
          setCurrentChapterContent(data);
        }
      });
  }, [chapterPassword]);

  return {
    currentChapterIndex,
    setCurrentChapterIndex,
    setChapterPassword,
    currentChapterContent,
  };
}
