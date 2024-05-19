<script lang="ts">
  import Game from "./Game.svelte";
  import { signer } from "./stores/burnerWallet";
  import { thc } from "./stores/thc";
</script>

{#if $signer && $thc}
  <Game signer={$signer} thc={$thc} />
{/if}
