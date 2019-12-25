<script>
  import { onMount } from "svelte";
  import { wallet, currentQuest, current, provider, thc } from "./stores";
  import marked from "marked";
  import ethers from "ethers";

  async function load() {
    console.log("loading");
    const players = await $thc.functions.getPlayers();
    console.log(players);
  }
  load();
</script>

<style>
  h1 {
    color: green;
  }
</style>

<h1>Leaderboard</h1>
