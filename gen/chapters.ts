import { readFile, writeFile, readdir, mkdir, rename } from "fs/promises";
import path from "path";
import { Wallet, keccak256, toUtf8Bytes } from "ethers";
import CryptoJS from "crypto-js";
import { create as ipfsCreate, globSource } from "ipfs-http-client";

const DIR_IN = process.argv[2];
const DIR_OUT = process.argv[3];
const IPFS_PROTOCOL = process.env["IPFS_PROTOCOL"];
const IPFS_HOST = process.env["IPFS_HOST"];
const IPFS_PORT = parseInt(process.env["IPFS_PORT"] || "5001", 10);
const IPFS_TOKEN = process.env["IPFS_TOKEN"];

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
  let solution = "";
  try {
    solution = (await readFile(f, "utf8")).trim();
    solution = solution.toLowerCase();
  } catch (e: any) {
    if (e.code !== "ENOENT") {
      throw e;
    }
  }
  return solution;
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
  const solutionHash = keccak256(toUtf8Bytes(solutionBuffer));
  const address = new Wallet(solutionHash).address;
  await writeFile(addressFileOut, address);

  if (prevSolution.length) {
    questOut = CryptoJS.AES.encrypt(
      questIn.toString(),
      keccak256(toUtf8Bytes(prevSolution)).toString()
    ).toString();
  } else {
    questOut = questIn.toString();
  }
  await writeFile(questFileOut, questOut);
  return { fileOut: questFileOut, address, quest: questOut };
}

async function upload(directory: string) {
  const filenames = await readdir(directory);
  let hash = "";
  for (let filename in filenames) {
    const content = await readFile(path.join(directory, filename), "utf8");
    hash = keccak256(toUtf8Bytes(content + hash));
  }
  return hash;
}

async function uploadIPFS(directory: string) {
  const ipfs = ipfsCreate({
    host: IPFS_HOST,
    port: IPFS_PORT,
    protocol: IPFS_PROTOCOL,
    headers: {
      authorization: "Basic " + btoa(IPFS_TOKEN!),
    },
  });

  let dirCid = "";
  for await (const file of ipfs.addAll(globSource(directory, "**/*"), {
    wrapWithDirectory: true,
  })) {
    await ipfs.pin.add(file.cid);
    dirCid = file.cid.toString();
  }

  return dirCid;
}

async function processChapter(dirIn: string, dirOut: string, solution: string) {
  const { fileOut, address, quest } = await chapter(dirIn, dirOut, solution);
  return { solutionAddress: address, quest: quest, questFile: fileOut };
}

async function main(dirIn: string, dirOut: string) {
  const questsDir = path.join(dirOut, "quests");
  const content = await readdir(dirIn, { withFileTypes: true });
  const v = content.filter((x) => x.isDirectory());
  const padding = v[0].name.length;
  const result = [];
  const chapters = [];

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
    const { solutionAddress, quest, questFile } = await processChapter(
      path.join(dirIn, name),
      path.join(dirOut, name),
      solution
    );

    // put encrypted quest in one folder, named after the chapter number
    await rename(questFile, path.join(questsDir, `${i}`));

    chapters.push(quest);

    result.push({
      solutionAddress,
      quest,
      questHash: "", // will be added after all quests are uploaded and wrapped
    });
  }

  // add all encrypted quests at once
  const dirCid = await upload(questsDir);

  for (let i = 0; i < v.length; i++) {
    result[i].questHash = `${dirCid}/${i}`;
  }

  // God forgive me this code is shit
  const wwwPublicPath = path.join("../www/public/game-data", dirCid);
  await mkdir(wwwPublicPath, {
    recursive: true,
  });

  for (let i = 0; i < chapters.length; i++) {
    await writeFile(path.join(wwwPublicPath, i.toString()), chapters[i]);
  }

  return result;
}

main(DIR_IN, DIR_OUT)
  .then((r) => console.log(JSON.stringify(r, null, 2)))
  .catch((e) => console.log(e));
