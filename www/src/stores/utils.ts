import {
  derived,
  type Writable,
  type Readable,
  type Unsubscriber,
  writable,
  type Subscriber,
  get,
} from "svelte/store";
import { RecoverableError } from "./exceptions";
import { panic } from "./runtime";

declare type Stores =
  | Readable<any>
  | [Readable<any>, ...Array<Readable<any>>]
  | Array<Readable<any>>;
declare type StoresValues<T> = T extends Readable<infer U>
  ? U
  : {
      [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
    };

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

export function derivedWhile<S extends Stores, T>(
  stores: S,
  fn: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void,
  predicate: (newValue: T, oldValue: T) => boolean,
  initial_value?: T
): Readable<T> {
  const d = derived(stores, fn, initial_value);
  const w = writable<T>(initial_value);
  let unsubscribeDerived: Unsubscriber | null;

  unsubscribeDerived = d.subscribe((newValue) => {
    const oldValue = get(w);
    //console.log(
    //  "derived while values",
    //  newValue,
    //  oldValue,
    //  predicate(newValue, oldValue),
    //  unsubscribeDerived
    //);
    w.set(newValue);
    if (!predicate(newValue, oldValue)) {
      if (unsubscribeDerived) {
        unsubscribeDerived();
        unsubscribeDerived = null;
      }
    }
  });
  return {
    subscribe: (run: Subscriber<T>): Unsubscriber => {
      const unsubscribeWritable = w.subscribe(run);
      return () => {
        //console.log("while", unsubscribeDerived, unsubscribeWritable);
        if (unsubscribeDerived) unsubscribeDerived();
        unsubscribeWritable();
      };
    },
  };
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function retry(f: () => Promise<void>) {
  return async () => {
    for (let i = 0; i < 3; i++) {
      try {
        return await f();
      } catch (e: any) {
        if (e instanceof RecoverableError) {
          console.error("Retry", i + 1, e);
          await sleep(1000);
        } else {
          console.log("Unknown error");
          throw e;
        }
      }
    }
    console.error("Panic", f);
    panic.set(true);
    //throw new Panic("Panic");
  };
}
