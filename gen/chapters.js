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
const SOLUTION = process.argv[4];

function lpad(s, length, fill = "0") {
  s = s.toString();
  while (s.length < length) s = fill + s;
  return s;
}

function c(a) {
  return `[${a.join(",")}]`;
}

async function chapter(dirIn, dirOut, solution) {
  let quest;
  let questFile = path.join(dirIn, "quest.md");
  let solutionFile = path.join(dirIn, "solution");
  let questAddress = path.join(dirOut, "solution.address");
  let questEnc = path.join(dirOut, "quest.aes.md");
  await mkdir(dirOut, { recursive: true });
  const address = new ethers.Wallet(
    ethers.utils.keccak256(await readFile(solutionFile))
  ).address;

  if (solution) {
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(solution));
    const key = hash.toString();
    const quest = (await readFile(questFile)).toString();
    const cipher = CryptoJS.AES.encrypt(quest, key);

    await writeFile(questAddress, address);
    await writeFile(questEnc, cipher.toString());

    console.log(key);
    console.log(cipher.toString());
  } else {
    await writeFile(questEnc, cipher.toString());
  }
  return { fileOut: questEnc, address };
}

async function upload(contentBuffer) {
  const ipfs = ipfsClient({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https"
  });
  return new Promise(resolve => {
    ipfs.add(contentBuffer, (err, result) => {
      // Upload buffer to IPFS
      if (err) {
        console.error(err);
        return;
      }
      let url = `https://ipfs.io/ipfs/${result[0].hash}`;
      resolve(result[0].hash);
      console.log(url);
    });
  });
}

async function main(dirIn, dirOut, solution) {
  const { fileOut, address } = await chapter(dirIn, dirOut, solution);
  const questHash = await upload(await readFile(fileOut));
  return { questHash, solutionAddress: address };
}

try {
  main(DIR_IN, DIR_OUT, SOLUTION).then(console.log);
} catch (e) {
  console.log(e);
}
