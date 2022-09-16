import { readFile, writeFile, readdir, mkdir } from "fs/promises";
import path from "path";
import { ethers } from "ethers";
import { toUtf8Bytes, keccak256 } from "ethers/lib/utils";
import CryptoJS from "crypto-js";
import { create as ipfsCreate } from "ipfs-http-client";

const ALGORITHM = "aes-128-gcm";
const DIR_IN = process.argv[2];
const DIR_OUT = process.argv[3];
const IPFS_PROTOCOL = process.env["IPFS_PROTOCOL"];
const IPFS_HOST = process.env["IPFS_HOST"];
const IPFS_PORT = parseInt(process.env["IPFS_PORT"] || "5001", 10);
const IPFS_LOCATION = process.env["IPFS_LOCATION"];
const IPFS_TOKEN = process.env["IPFS_TOKEN"];

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
  const questIn = await readFile(questFileIn);
  let questOut: string;

  await mkdir(dirOut, { recursive: true });

  const solutionBuffer = await readFileAndTrim(solutionFileIn);
  const solutionHash = keccak256(toUtf8Bytes(solutionBuffer));
  const address = new ethers.Wallet(solutionHash).address;
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

async function upload(contentBuffer: Buffer) {
  const ipfs = ipfsCreate({
    host: IPFS_HOST,
    port: IPFS_PORT,
    protocol: IPFS_PROTOCOL,
    headers: {
      authorization: "Basic " + btoa(IPFS_TOKEN!),
    },
  });
  const { cid } = await ipfs.add(contentBuffer);
  await ipfs.pin.add(cid);
  return cid.toV0().toString();
}

async function processChapter(dirIn: string, dirOut: string, solution: string) {
  const { fileOut, address, quest } = await chapter(dirIn, dirOut, solution);
  const questHash = await upload(await readFile(fileOut));
  return { solutionAddress: address, quest, questHash };
}

async function main(dirIn: string, dirOut: string) {
  const content = await readdir(dirIn, { withFileTypes: true });
  const v = content.filter((x) => x.isDirectory());
  const padding = v[0].name.length;
  const result = [];

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
    result.push(
      await processChapter(
        path.join(dirIn, name),
        path.join(dirOut, name),
        solution
      )
    );
  }
  return result;
}

main(DIR_IN, DIR_OUT)
  .then((r) => console.log(JSON.stringify(r, null, 2)))
  .catch((e) => console.log(e));
