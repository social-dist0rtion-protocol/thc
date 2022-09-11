import { writable } from "svelte/store";
import type { ValueOrFunction } from "./db";
import db from "./db";

export function writableLocalStorage<T>(
  key: string,
  valueOrFunction: ValueOrFunction<T>
) {
  const value = writable(db.getsert(key, valueOrFunction));
  value.subscribe((current) => {
    db.set(key, current);
  });
  return value;
}
