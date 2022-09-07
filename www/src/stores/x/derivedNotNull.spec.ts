import { get, writable } from "svelte/store";
import { derivedNotNull } from "./derivedNotNull";

test("derived single", () => {
  const s = writable(0);
  const d = derivedNotNull(s, ($s) => {
    console.log($s);
  });
  get(d);
});

test("derived multiple", () => {
  const s = writable(0);
  const t = writable(1);
  const d = derivedNotNull([s, t], ([$s, $t]) => {
    console.log($s, $t);
  });
  get(d);
});
