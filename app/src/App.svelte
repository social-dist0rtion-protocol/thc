<script>
import Router from "svelte-spa-router";
import Chapter from "./Chapter.svelte";
import Leaderboard from "./Leaderboard.svelte";
import Settings from "./Settings.svelte";

const routes = {
  "/": Chapter,
  "/leaderboard": Leaderboard,
  "/settings": Settings

};
</script>

<nav>
  <ul>
    <li><a href="#/">Current Chapter</a></li>
    <li><a href="#/leaderboard">Leaderboard</a></li>
    <li><a href="#/settings">Settings</a></li>
  </ul>
</nav>
<Router {routes}/>
