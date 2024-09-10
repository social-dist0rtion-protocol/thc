#!/usr/bin/env node

import { Command } from "commander";
import { mkdir } from "fs/promises";
import { main } from "./utils";
import path from "path";

const program = new Command();

program.name("thc").description("Wow we have a CLI now!").version("0.0.1");

const ARTIFACTS_PATH = ".artifacts";
const CHAPTERS_PATH = path.join(ARTIFACTS_PATH, "chapters");
const METADATA_PATH = path.join(ARTIFACTS_PATH, "metadata.json");
const ROOT_HASH_PATH = path.join(ARTIFACTS_PATH, "root-hash");

program
  .command("roll <basePath>")
  .description("Build chapters artifacts")
  .action(async (basePath: string) => {
    await main(
      path.join(basePath, "chapters"),
      CHAPTERS_PATH,
      METADATA_PATH,
      ROOT_HASH_PATH
    );
  });

async function run() {
  await mkdir(ARTIFACTS_PATH, {
    recursive: true,
  });
  program.parse(process.argv);
}

run();
