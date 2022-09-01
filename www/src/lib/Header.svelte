<script lang="ts">
  import ConnectWallet from "./ConnectWallet.svelte";
  import { signer, address, balance, network } from "../stores/wallet";
  import { formatEther } from "ethers/lib/utils";
</script>

<ConnectWallet />
{#if $signer}
  <ul>
    <li>Address: {$address}</li>
    <li>Network: {$network}</li>
    {#if $balance}
      <li>Balance: {formatEther($balance)} Eth</li>
    {/if}
  </ul>
{/if}
