import Game from "./Game.svelte";
import Keys from "./Keys.svelte";
import Leaderboard from "./Leaderboard.svelte";
import Settings from "./Settings.svelte";
import About from "./About.svelte";
import NotFound from "./NotFound.svelte";

export const routes = {
  "/": Game,
  "/keys": Keys,
  "/leaderboard": Leaderboard,
  "/settings": Settings,
  "/about": About,
  "*": NotFound,
};
