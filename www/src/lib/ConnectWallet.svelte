<script lang="ts">
  import { connect, disconnect, signer } from "../stores/wallet";

  let error: string;

  async function handleConnect() {
    try {
      await connect();
    } catch (e) {
      console.log("Error:", e);
      error = "Unable to connect your wallet.";
    }
  }

  async function handleDisconnect() {
    await disconnect();
  }
</script>

{#if $signer}
  <button on:click={handleDisconnect}>Disconnect wallet</button>
{:else}
  <button on:click={handleConnect}>Connect wallet</button>
  {#if error}
    <p>{error}</p>
  {/if}
{/if}
