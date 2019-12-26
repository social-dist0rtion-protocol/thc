import * as fs from "fs";
import copy from "rollup-plugin-copy";
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import replace from "@rollup/plugin-replace";
import svelte from "rollup-plugin-svelte";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";

const dev = process.env.ROLLUP_WATCH;
const legacy = !!process.env.SAPPER_LEGACY_BUILD;
const onwarn = (warning, onwarn) =>
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning);
const dedupe = importee =>
  importee === "svelte" || importee.startsWith("svelte/");

export default {
  input: "src/index.js",
  output: {
    file: "build/bundle.js",
    format: "iife"
  },
  plugins: [
    copy({
      targets: [
        { src: "public/global.css", dest: "build" },
        { src: "public/index.html", dest: "build" },
        { src: "public/assets", dest: "build" }
      ]
    }),
    svelte({
      css: css => css.write("build/bundle.css")
    }),
    json(),
    // rollup-plugin-node-resolve embeds external dependencies in the bundle,
    // more info here:
    // https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
    resolve({ browser: true, dedupe }),
    replace({
      __NETWORK_CONFIG__: JSON.stringify({
        IPFS_HOST: process.env["IPFS_HOST"] || "http://localhost",
        IPFS_PORT: process.env["IPFS_POST"] || "5001",
        IPFS_PROTOCOL: process.env["IPFS_PROTOCOL"],
        IPFS_LOCATION:
          process.env["IPFS_LOCATION"] || "http://localhost:8080/ipfs/"
      })
    }),
    commonjs(),
    // https://github.com/thgh/rollup-plugin-serve
    dev &&
      serve({
        contentBase: "build",
        open: true,
        host: "0.0.0.0",
        port: 4000
      }),
    dev && livereload("build"),
    !dev && terser()
  ],
  watch: {
    clearScreen: true,
    chokidar: {
      usePolling: true
    }
  },
  onwarn
};
