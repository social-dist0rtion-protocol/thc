const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const ethers = require("ethers");
const CryptoJS = require("crypto-js");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const ALGORITHM = "aes-128-gcm";

const dir = process.argv[2];

function lpad(s, length, fill = "0") {
  s = s.toString();
  while (s.length < length) s = fill + s;
  return s;
}

function c(a) {
  return `[${a.join(",")}]`;
}

async function chapter(root, number, padding = 3) {
  let quest;
  let password;
  let questFile = path.join(root, "chapters", lpad(number, 3), "quest.md");
  let questAddress = path.join(root, "build", lpad(number, 3), "solution");
  let questEnc = path.join(root, "build", lpad(number, 3), "quest.aes.md");
  await mkdir(path.join(root, "build", lpad(number, 3)), { recursive: true });

  try {
    password = await readFile(
      path.join(root, "chapters", lpad(number - 1, 3), "password")
    );
  } catch (e) {}

  if (password) {
    const hash = ethers.utils.keccak256(password);
    const key = hash.toString();
    const address = new ethers.Wallet(hash).address;
    const quest = (await readFile(questFile)).toString();
    const cipher = CryptoJS.AES.encrypt(quest, key);

    await writeFile(questAddress, address);
    await writeFile(questEnc, cipher.toString());

    console.log(key);
    console.log(cipher.toString());
  }
}

try {
  chapter(dir, 1);
} catch (e) {
  console.log(e);
}
