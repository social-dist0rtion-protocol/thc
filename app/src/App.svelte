<script>
  import Router from "svelte-spa-router";
  import Chapter from "./Chapter.svelte";
  import Leaderboard from "./Leaderboard.svelte";
  import About from "./About.svelte";
  import Settings from "./Settings.svelte";
  import { wallet, provider, thc } from "./stores";

  const routes = {
    "/": Chapter,
    "/leaderboard": Leaderboard,
    "/about": About,
    "/settings": Settings
  };
</script>

<style>
  .container {
    padding: var(--space-s);
    max-width: 666px;
    margin: 0 auto;
  }
</style>

<div class="container">
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
      <li>
        <a href="#/about">&nbsp;?&nbsp;</a>
      </li>
    </ul>
  </nav>

  <main>
    {#if $wallet && $provider && $thc}
      <Router {routes} />
    {:else}
      <p>Loading...</p>
    {/if}
  </main>
</div>
