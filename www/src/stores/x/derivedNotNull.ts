import { derived, type Readable, type Unsubscriber } from "svelte/store";
import type { Stores, StoresValues } from "./types";

export function derivedNotNull<S extends Stores, T>(
  stores: S,
  fn: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void,
  initialValue?: T
) {
  return derived(stores, (values, set) => {
    const single = !Array.isArray(values);
    console.log(single);
    const valuesArray: Array<any> = single ? [stores] : (stores as Array<any>);
    for (let i = 0; i < valuesArray.length; i++) {
      if (valuesArray[i] === null) {
        return;
      }
    }
  });
}
