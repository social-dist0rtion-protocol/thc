import Game from "./Game.svelte";
import Leaderboard from "./Leaderboard.svelte";
import Settings from "./Settings.svelte";
import About from "./About.svelte";
import Browser from "./Browser.svelte";
import NotFound from "./NotFound.svelte";

export const routes = {
  "/": Game,
  "/leaderboard": Leaderboard,
  "/settings": Settings,
  "/about": About,
  "/browser": Browser,
  "*": NotFound,
};
