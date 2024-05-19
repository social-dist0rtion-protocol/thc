<script lang="ts">
  import { signer } from "./stores/burnerWallet";
  import { leaderboard, ensAddresses } from "./stores/thc";
  import Leaderboard from "./components/Leaderboard.svelte";
  $: address = $signer?.getAddress();
</script>

<h1>Leaderboard</h1>
{#if $leaderboard && address && $ensAddresses}
  {#await address then addr}
    <Leaderboard
      address={addr}
      ensAddresses={$ensAddresses}
      leaderboard={$leaderboard}
    />
  {/await}
{/if}
