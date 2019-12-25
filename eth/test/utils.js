const web3 = require("web3");
const BN = web3.utils.BN;
const crypto = require("crypto");
const ethers = require("ethers");

// Generate a sha256 of some content, which is the right most 32 bytes of an IPFS hash
function getQuestBytes(content) {
  let hash = crypto
    .createHash("sha256")
    .update(content)
    .digest()
    .toString("ascii");
  return web3.utils.asciiToHex(hash);
}

async function getSolutionAddress(solution) {
  let solutionBytes = ethers.utils.toUtf8Bytes(solution);
  let solutionDigest = ethers.utils.keccak256(solutionBytes);
  let wallet = new ethers.Wallet(solutionDigest);
  return wallet.address;
}

async function getSolutionSignature(solution, address) {
  let solutionBytes = ethers.utils.toUtf8Bytes(solution);
  let solutionDigest = ethers.utils.keccak256(solutionBytes);
  let wallet = new ethers.Wallet(solutionDigest);
  let signature = await wallet.signMessage(ethers.utils.arrayify(address));
  let { v, r, s } = ethers.utils.splitSignature(signature);
  return [v, r, s];
}

async function getSignature(solution) {
  let solutionBytes = ethers.utils.toUtf8Bytes(solution);
  let solutionDigest = ethers.utils.keccak256(solutionBytes);
  let wallet = new ethers.Wallet(solutionDigest);
  let signature = await wallet.signMessage(ethers.utils.arrayify(accounts[0]));

  return [signature, wallet.address];
}

function merge(address, chapter) {
  return new BN(address.replace("0x", ""), 16).shln(96).or(new BN(chapter));
}

module.exports = {
  getQuestBytes,
  getSolutionAddress,
  getSolutionSignature,
  getSignature,
  merge
};
