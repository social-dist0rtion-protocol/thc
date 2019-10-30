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
  } else {
    await writeFile(questEnc, await readFile(questFile));
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
    });
  });
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
    let solution;
    try {
      solution = (await readFile(
        path.join(dirIn, lpad(number - 1, 3), "solution")
      )).toString();
    } catch (e) {
      if (e.code !== "ENOENT") {
        raise(e);
      }
    }
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
  //main(DIR_IN, DIR_OUT, SOLUTION).then(console.log);
} catch (e) {
  console.log(e);
}
