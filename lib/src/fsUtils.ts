import { readFile } from "fs/promises";
import path from "path";
import { Hex } from "viem";
import { Metadata } from "./types";

const ARTIFACTS_PATH = "artifacts";

export function getArtifactsPath(basePath: string) {
  return path.join(basePath, ARTIFACTS_PATH);
}

export function getChaptersPath(basePath: string) {
  return path.join(getArtifactsPath(basePath), "chapters");
}

export function getMetadataPath(basePath: string) {
  return path.join(getArtifactsPath(basePath), "metadata.json");
}

export function getRootHashPath(basePath: string) {
  return path.join(getArtifactsPath(basePath), "root-hash");
}

export async function readRootHash(basePath: string) {
  return (await readFile(getRootHashPath(basePath), "utf8")) as Hex;
}

export async function readMetadata(artifactsPath: string) {
  return JSON.parse(
    await readFile(getMetadataPath(artifactsPath), "utf8")
  ) as Metadata;
}
