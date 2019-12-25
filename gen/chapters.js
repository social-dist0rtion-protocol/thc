const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const ethers = require("ethers");
const CryptoJS = require("crypto-js");
const ipfsClient = require("ipfs-http-client");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const ALGORITHM = "aes-128-gcm";
const DIR_IN = process.argv[2];
const DIR_OUT = process.argv[3];
const IPFS_PROTOCOL = process.env["IPFS_PROTOCOL"];
const IPFS_HOST = process.env["IPFS_HOST"];
const IPFS_PORT = process.env["IPFS_PORT"];
const IPFS_LOCATION = process.env["IPFS_LOCATION"];

function lpad(s, length, fill = "0") {
  s = s.toString();
  while (s.length < length) s = fill + s;
  return s;
}

async function readFileAndTrim(f) {
  let solution = "";
  try {
    solution = (await readFile(f)).toString().trim();
  } catch (e) {
    if (e.code !== "ENOENT") {
      raise(e);
    }
  }
  return ethers.utils.toUtf8Bytes(solution);
}

async function chapter(dirIn, dirOut, prevSolution) {
  const questFileIn = path.join(dirIn, "quest.md");
  const solutionFileIn = path.join(dirIn, "solution");
  const addressFileOut = path.join(dirOut, "solution.address");
  const questFileOut = path.join(dirOut, "quest.aes.md");
  const questIn = await readFile(questFileIn);
  let questOut;

  await mkdir(dirOut, { recursive: true });

  const solutionBuffer = await readFileAndTrim(solutionFileIn);
  const solutionHash = ethers.utils.keccak256(solutionBuffer);
  const address = new ethers.Wallet(solutionHash).address;
  await writeFile(addressFileOut, address);

  if (prevSolution.length) {
    questOut = CryptoJS.AES.encrypt(
      questIn.toString(),
      ethers.utils.keccak256(prevSolution).toString()
    );
  } else {
    questOut = questIn.toString();
  }
  await writeFile(questFileOut, questOut);
  return { fileOut: questFileOut, address };
}

async function upload(contentBuffer) {
  const ipfs = ipfsClient({
    host: IPFS_HOST,
    port: IPFS_PORT,
    protocol: IPFS_PROTOCOL
  });
  const result = await ipfs.add(contentBuffer);
  const hash = result[0].hash;
  await ipfs.pin.add(hash);
  return hash;
}

async function processChapter(dirIn, dirOut, solution) {
  const { fileOut, address } = await chapter(dirIn, dirOut, solution);
  const questHash = await upload(await readFile(fileOut));
  return { questHash, solutionAddress: address };
}

async function main(dirIn, dirOut) {
  const content = fs.readdirSync(dirIn, { withFileTypes: true });
  const v = content.filter(x => x.isDirectory());
  const result = [];

  for (let i = 0; i < v.length; i++) {
    const name = v[i].name;
    const number = parseInt(name, 10);
    let solution = await readFileAndTrim(
      path.join(dirIn, lpad(number - 1, 3), "solution")
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

try {
  main(DIR_IN, DIR_OUT).then(r => console.log(JSON.stringify(r, null, 2)));
} catch (e) {
  console.log(e);
}
