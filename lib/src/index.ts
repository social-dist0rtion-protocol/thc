import { keccak256, toUtf8Bytes } from "ethers/lib/utils";
import CryptoJS from "crypto-js";
import { ethers } from "ethers";

type Chapter = {
  quest: string;
  solution: string | null;
};

type Story = Chapter[];

type EncryptedChapter = {
  quest: string;
  address: string | null;
};

type EncryptedStory = EncryptedChapter[];

export function encryptChapter(
  chapter: Chapter,
  previousSolution: string | null
): EncryptedChapter {
  let quest: string;
  let address: string | null;

  if (previousSolution === null) {
    quest = chapter.quest;
  } else {
    const previousSolutionHash = keccak256(toUtf8Bytes(previousSolution));

    quest = CryptoJS.AES.encrypt(
      chapter.quest,
      previousSolutionHash.toString()
    ).toString();
  }

  if (chapter.solution === null) {
    address = null;
  } else {
    const solutionHash = keccak256(toUtf8Bytes(chapter.solution));
    address = new ethers.Wallet(solutionHash).address;
  }

  return {
    quest,
    address,
  };
}

export function encryptStory(story: Story) {
  let previousSolution: string | null = null;
  const encryptedStory: EncryptedStory = [];

  for (let chapter of story) {
    encryptedStory.push(encryptChapter(chapter, previousSolution));
    previousSolution = chapter.solution;
  }

  return encryptedStory;
}

export function decryptQuest(quest: string, solution: string) {}
