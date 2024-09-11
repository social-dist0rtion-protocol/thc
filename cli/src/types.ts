import { Hex } from "viem";

export type Config = {
  chainId: number;
  thcAddress: Hex;
};

export function isHexString(value: unknown): value is `0x${string}` {
  return typeof value === "string" && value.startsWith("0x");
}