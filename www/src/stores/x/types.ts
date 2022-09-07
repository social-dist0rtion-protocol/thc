// Waiting for https://github.com/sveltejs/svelte/pull/7358 to be merged
import type { Readable } from "svelte/store";

/** One or more `Readable`s. */
export type Stores =
  | Readable<any>
  | [Readable<any>, ...Array<Readable<any>>]
  | Array<Readable<any>>;

/** One or more values from `Readable` stores. */
export type StoresValues<T> = T extends Readable<infer U>
  ? U
  : {
      [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
    };
