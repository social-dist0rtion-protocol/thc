<script lang="ts">
  import { signer } from "../stores/wallet";
  let message = "";
  let signedMessage = "";

  async function handleSubmit() {
    signedMessage = await $signer!.signMessage(message);
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={message} />
  <button type="submit">Sign</button>
</form>

{#if signedMessage}
  <p>{signedMessage}</p>
{/if}
