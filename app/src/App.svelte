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

<style>
  main {
    padding: var(--space-s);
    max-width: 666px;
    margin: 0 auto;
  }
</style>

<nav>
  <ul>
    <li>
      <a href="#/">Game</a>
    </li>
    <li>
      <a href="#/leaderboard">Leaderboard</a>
    </li>
    <li>
      <a href="#/settings">Settings</a>
    </li>
  </ul>
</nav>
<main>
  <Router {routes} />
</main>
