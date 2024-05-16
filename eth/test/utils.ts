import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { Signature, Wallet, keccak256, toUtf8Bytes } from "ethers";
import { CID } from "multiformats/cid";

export function cidToBytes(cid: string) {
  return CID.parse(cid).bytes;
}

export async function getSolutionAddress(solution: string) {
  let solutionBytes = toUtf8Bytes(solution);
  let solutionDigest = keccak256(solutionBytes);
  let wallet = new Wallet(solutionDigest);
  return wallet.address;
}

export async function getSolutionSignature(solution: string, address: string) {
  let solutionBytes = toUtf8Bytes(solution);
  let solutionDigest = keccak256(solutionBytes);
  let wallet = new Wallet(solutionDigest);
  let signature = await wallet.signMessage(toUtf8Bytes(address));
  return Signature.from(signature);
}

export async function getSignature(
  signer: SignerWithAddress,
  solution: string
) {
  let solutionBytes = toUtf8Bytes(solution);
  let solutionDigest = keccak256(solutionBytes);
  let wallet = new Wallet(solutionDigest);
  let signature = await wallet.signMessage(toUtf8Bytes(signer.address));

  return [signature, wallet.address];
}

export function merge(address: string, chapter: number) {
  const addressBigInt = BigInt(address);
  const chapterBigInt = BigInt(chapter);

  return (addressBigInt << 96n) | chapterBigInt;
}

export function leaderboardEntry(
  address: string,
  keys: number[],
  chapter: number
) {
  const addressBigInt = BigInt(address) << 96n;

  let keysBigInt = 0n;
  for (let pos of keys) {
    keysBigInt |= 1n << BigInt(pos);
  }
  keysBigInt <<= 8n;

  const chapterBigInt = BigInt(chapter);

  return addressBigInt | keysBigInt | chapterBigInt;
}
