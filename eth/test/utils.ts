import web3 from "web3";
import crypto from "crypto";
import { BigNumber, utils, Wallet } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// Generate a sha256 of some content, which is the right most 32 bytes of an IPFS hash
export function getQuestBytes(content: string) {
  let hash = crypto
    .createHash("sha256")
    .update(content)
    .digest()
    .toString("ascii");
  return web3.utils.asciiToHex(hash);
}

export async function getSolutionAddress(solution: string) {
  let solutionBytes = utils.toUtf8Bytes(solution);
  let solutionDigest = utils.keccak256(solutionBytes);
  let wallet = new Wallet(solutionDigest);
  return wallet.address;
}

export async function getSolutionSignature(solution: string, address: string) {
  let solutionBytes = utils.toUtf8Bytes(solution);
  let solutionDigest = utils.keccak256(solutionBytes);
  let wallet = new Wallet(solutionDigest);
  let signature = await wallet.signMessage(utils.arrayify(address));
  return utils.splitSignature(signature);
}

export async function getSignature(
  signer: SignerWithAddress,
  solution: string
) {
  let solutionBytes = utils.toUtf8Bytes(solution);
  let solutionDigest = utils.keccak256(solutionBytes);
  let wallet = new Wallet(solutionDigest);
  let signature = await wallet.signMessage(utils.arrayify(signer.address));

  return [signature, wallet.address];
}

export function merge(address: string, chapter: number) {
  return BigNumber.from(address).shl(96).or(BigNumber.from(chapter));
}
