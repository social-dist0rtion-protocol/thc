import { CID } from "multiformats/cid";
import { BigNumber, utils, Wallet } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export function cidToBytes(cid: string) {
  return CID.parse(cid).bytes;
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
