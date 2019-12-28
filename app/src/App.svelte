<script>
  import Router from "svelte-spa-router";
  import Chapter from "./Chapter.svelte";
  import Leaderboard from "./Leaderboard.svelte";
  import About from "./About.svelte";
  import Settings from "./Settings.svelte";
  import { wallet, provider, fundRequest, balance, thc } from "./stores";

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
        <a href="#/about">???</a>
      </li>
    </ul>
  </nav>
  <main>
    {#if $fundRequest !== undefined && $fundRequest.error}
      <p class="error">
        There was an error setting up the application. Would be great if you can
        message us
        <a href="https://twitter.com/dist0rtionproto">on Twitter</a>
        .
      </p>
    {/if}
    {#if $wallet && $provider && $thc}
      <Router {routes} />
    {:else}
      <p>Loading... (Might take some time on old phones, like 30 seconds.)</p>
    {/if}
  </main>
</div>
