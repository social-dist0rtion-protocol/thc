import { writable } from "svelte/store";

export const panic = writable(false);

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled Rejection", e);
  panic.set(true);
});
