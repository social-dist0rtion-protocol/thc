#!/usr/bin/env node

import { Command } from "commander";
import { main } from "./utils";

const program = new Command();

program.name("thc").description("Wow we have a CLI now!").version("0.0.1");

program
  .command("build-chapters <dirIn> <dirOut> <metadataPath>")
  .description("Build chapters")
  .action(async (dirIn: string, dirOut: string, metadataPath: string) => {
    await main(dirIn, dirOut, metadataPath);
  });

program.parse(process.argv);
