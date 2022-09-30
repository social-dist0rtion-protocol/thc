import {
  derived,
  writable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from "svelte/store";
import type { Stores, StoresValues } from "./types";

export function derivedWritable<S extends Stores, T>(
  stores: S,
  fn: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void,
  initial_value?: T
): Writable<T> {
  const d = derived(stores, fn, initial_value);
  const w = writable<T>(initial_value);
  let unsubscribeDerived: Unsubscriber | null = d.subscribe((value) => {
    w.set(value);
  });
  return {
    set: (value) => {
      if (unsubscribeDerived) {
        unsubscribeDerived();
        unsubscribeDerived = null;
      }
      w.set(value);
    },
    update: w.update,
    subscribe: (run: Subscriber<T>): Unsubscriber => {
      const unsubscribeWritable = w.subscribe(run);
      return () => {
        //console.log("writable", unsubscribeDerived, unsubscribeWritable);
        if (unsubscribeDerived) unsubscribeDerived();
        unsubscribeWritable();
      };
    },
  };
}
