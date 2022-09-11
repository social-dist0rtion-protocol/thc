<script lang="ts">
  import { address } from "./stores/burnerWallet";
  import { leaderboard } from "./stores/thc";
  import Leaderboard from "./components/Leaderboard.svelte";
</script>

{#if $leaderboard && $address}
  <Leaderboard address={$address} leaderboard={$leaderboard} />
{/if}
