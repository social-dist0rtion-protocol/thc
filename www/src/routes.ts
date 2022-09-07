import Game from "./Game.svelte";
import Leaderboard from "./Leaderboard.svelte";
import NotFound from "./NotFound.svelte";

export const routes = {
  // Exact path
  "/": Game,

  "/leaderboard": Leaderboard,

  // Catch-all
  // This is optional, but if present it must be the last
  "*": NotFound,
};
