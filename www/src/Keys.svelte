<script lang="ts">
  import { fuckFuckFuckFuckFuck, thc } from "./stores/thc";
  import { signer } from "./stores/burnerWallet";
  import { fade } from "svelte/transition";
  import { signatureFromSolution } from "./lib";

  let state: "IDLE" | "CHECK" | "MINING" | "SUCCESS" | "WRONG" | "ERROR" =
    "IDLE";
  let error: string;
  let key: string = "";

  async function onSubmitKey() {
    const address = $signer!.address;
    const contract = $thc!;
    state = "CHECK";
    const { r, s, v } = await signatureFromSolution(address, key);
    try {
      const tx = await contract.submitKey(v, r, s);
      console.log(tx);
      state = "MINING";
      const receipt = await tx.wait();
      console.log("Transaction Mined: " + receipt);
      console.log(receipt);
      state = "SUCCESS";
      return true;
    } catch (e: any) {
      const msg = e.toString() as string;
      if (msg.toLowerCase().includes("wrong")) {
        state = "WRONG";
      } else {
        console.log("error submitting solution", e);
        state = "ERROR";
        error = e.toString();
      }
      return false;
    }
  }

  function onCloseModal() {
    key = "";
    state = "IDLE";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

{#if $fuckFuckFuckFuckFuck}
  <p>
    The game is br0ken, something happened to the storage. Reach out to our
    discord and ask for help or go to <a href="#/settings">Settings</a> and restart
    the game.
  </p>
{:else if $signer !== null && $thc !== null}
  <p>
    Did you find a key? Submit it with this form to add it to your score in the
    leaderboard. More info in the <a href="#/about">FAQs</a>.
  </p>
  <form on:submit|preventDefault={onSubmitKey}>
    <input placeholder="Key" bind:value={key} />
    <button disabled={key.length === 0} type="submit">Submit</button>
  </form>

  {#if state !== "IDLE"}
    <div transition:fade class="thc--chapter-state">
      <div>
        {#if state === "CHECK"}
          <h2>Checking</h2>
          <p>Checking</p>
        {:else if state === "WRONG"}
          <h2>Wrong Key</h2>
          <button on:click={() => (state = "IDLE")}>Try again</button>
        {:else if state === "ERROR"}
          <p>
            Something bad happened, get in contact with us, we can help you.
          </p>
          <pre>{error}</pre>
        {:else}
          <h2>Correct Key</h2>
          {#if state === "MINING"}
            <p>Please wait some seconds because blockchains are fast.</p>
            <p>
              Keep this window open, wait, cross your fingers, don't enter any
              Faraday cage, don't drop your mobile phone in the toilet or in any
              other liquid, make sure you have enough battery left, don't lock
              your mobile phone.
            </p>
          {:else if state === "SUCCESS"}
            <p>Your score has been updated.</p>
            <button on:click={onCloseModal}>Close</button>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
{/if}
