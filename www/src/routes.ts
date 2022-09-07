import Game from "./Game.svelte";
import NotFound from "./NotFound.svelte";

export const routes = {
  // Exact path
  "/": Game,

  // Catch-all
  // This is optional, but if present it must be the last
  "*": NotFound,
};
