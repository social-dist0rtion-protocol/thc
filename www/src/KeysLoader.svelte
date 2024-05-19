<script lang="ts">
  import Keys from "./Keys.svelte";
  import { signer } from "./stores/burnerWallet";
  import { thc } from "./stores/thc";
</script>

{#if $signer && $thc}
  <Keys signer={$signer} thc={$thc} />
{/if}
