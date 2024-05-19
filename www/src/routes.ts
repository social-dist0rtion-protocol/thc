import Leaderboard from "./Leaderboard.svelte";
import Settings from "./Settings.svelte";
import About from "./About.svelte";
import NotFound from "./NotFound.svelte";
import GameLoader from "./GameLoader.svelte";
import KeysLoader from "./KeysLoader.svelte";

export const routes = {
  "/": GameLoader,
  "/keys": KeysLoader,
  "/leaderboard": Leaderboard,
  "/settings": Settings,
  "/about": About,
  "*": NotFound,
};
