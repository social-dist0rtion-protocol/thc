import { readFile, writeFile, readdir, mkdir, rename } from "fs/promises";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { keccak256, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { encrypt } from "./lib";

async function inlineImagesInMarkdown(filePath: string): Promise<string> {
  try {
    let markdown = await readFile(filePath, "utf8");

    const imageRegex = /!\[\]\((\.\/.+?\.(jpg|jpeg|png|gif))\)/g;
    let match: RegExpExecArray | null;

    while ((match = imageRegex.exec(markdown))) {
      const imagePath = match[1];
      const fullImagePath = path.join(path.dirname(filePath), imagePath);
      const imageBase64 = await readFile(fullImagePath, "base64");
      const imageExtension = path.extname(imagePath).substring(1);
      const dataUri = `data:image/${imageExtension};base64,${imageBase64}`;

      markdown = markdown.replace(match[0], `![](${dataUri})`);
    }

    return markdown;
  } catch (error) {
    console.error("Error processing markdown file:", error);
    throw error;
  }
}

async function readFileAndTrim(f: string) {
  let content = "";
  try {
    content = (await readFile(f, "utf8")).trim();
    content = content.toLowerCase();
  } catch (e: any) {
    if (e.code !== "ENOENT") {
      throw e;
    }
  }
  return content;
}

async function chapter(dirIn: string, dirOut: string, prevSolution: string) {
  const questFileIn = path.join(dirIn, "quest.md");
  const solutionFileIn = path.join(dirIn, "solution");
  const addressFileOut = path.join(dirOut, "solution.address");
  const questFileOut = path.join(dirOut, "quest.aes.md");
  // const questIn = await readFile(questFileIn);
  const questIn = await inlineImagesInMarkdown(questFileIn);
  let questOut: string;

  await mkdir(dirOut, { recursive: true });

  const solutionBuffer = await readFileAndTrim(solutionFileIn);
  const solutionHash = keccak256(toHex(solutionBuffer));
  const address = privateKeyToAccount(solutionHash).address;
  await writeFile(addressFileOut, address);

  if (prevSolution.length) {
    questOut = await encrypt(questIn, prevSolution);
  } else {
    questOut = questIn;
  }
  await writeFile(questFileOut, questOut);
  return {
    fileOut: questFileOut,
    address,
    quest: questOut,
    plaintext: questIn,
  };
}

async function readKeys(dirIn: string) {
  const keysFileIn = path.join(dirIn, "keys.csv");
  const keyBuffer = await readFileAndTrim(keysFileIn);
  const lines = keyBuffer
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const addresses = lines.map((line) => {
    const [key, emoji] = line.split(",");
    const solutionHash = keccak256(toHex(key));
    const address = privateKeyToAccount(solutionHash).address;
    return { address, emoji };
  });

  return addresses;
}

async function calculateHashChapters(chapters: string[]) {
  let hash = "";
  for (const chapter of chapters) {
    hash = keccak256(toHex(chapter + hash));
  }
  return hash;
}

async function processChapter(dirIn: string, dirOut: string, solution: string) {
  const { fileOut, address, quest, plaintext } = await chapter(
    dirIn,
    dirOut,
    solution
  );
  return {
    solutionAddress: address,
    quest: quest,
    questFile: fileOut,
    plaintext,
  };
}

export async function main(dirIn: string, dirOut: string) {
  const tmpDirOut = await fs.mkdtemp(path.join(os.tmpdir(), "thc-"));
  const questsDir = path.join(tmpDirOut, "quests");
  const content = await readdir(dirIn, { withFileTypes: true });
  const v = content.filter((x) => x.isDirectory());
  const padding = v[0].name.length;
  const quests = [];
  const chapters = [];
  const plaintextChapters = [];
  const keys = await readKeys(dirIn);

  await mkdir(questsDir, { recursive: true });

  for (let i = 0; i < v.length; i++) {
    const name = v[i].name;
    const number = parseInt(name, 10);
    let solution = await readFileAndTrim(
      path.join(
        dirIn,
        (number - 1).toString().padStart(padding, "0"),
        "solution"
      )
    );

    // collect chapter data
    const { solutionAddress, quest, questFile, plaintext } =
      await processChapter(
        path.join(dirIn, name),
        path.join(tmpDirOut, name),
        solution
      );

    // put encrypted quest in one folder, named after the chapter number
    await rename(questFile, path.join(questsDir, `${i}`));
    plaintextChapters.push(plaintext);
    quests.push(quest);

    chapters.push({
      solutionAddress,
      quest,
      questHash: "", // will be added after all quests are uploaded and wrapped
    });
  }

  // add all encrypted quests at once
  const dirCid = await calculateHashChapters(plaintextChapters);

  for (let i = 0; i < v.length; i++) {
    chapters[i].questHash = `${dirCid}/${i}`;
  }

  // God forgive me this code is shit
  // God forgive me this code is shit
  // God forgive me this code is shit
  const wwwPublicPath = path.join(dirOut, dirCid);
  await mkdir(wwwPublicPath, {
    recursive: true,
  });
  for (let i = 0; i < quests.length; i++) {
    await writeFile(path.join(wwwPublicPath, i.toString()), quests[i]);
  }
  await writeFile(
    path.join(dirOut, "metadata.json"),
    JSON.stringify({ keys, chapters: chapters.map((c) => c.solutionAddress) })
  );
  // God forgive me this code is shit
  // God forgive me this code is shit
  // God forgive me this code is shit

  return chapters;
}
