<script lang="ts">
  import { fuckFuckFuckFuckFuck } from "./stores/thc";
  import { fade } from "svelte/transition";
  import {
    addressFromSolution,
    addressToKeyIndex,
    prepareSubmitKey,
  } from "./lib";
  import type { Signer } from "ethers";
  import type { TreasureHuntCreator } from "../../eth/typechain";

  export let signer: Signer;
  export let thc: TreasureHuntCreator;

  let key = "";
  let wrongAnswer = false;

  const { submit, status, txHash, error, reset } = prepareSubmitKey(
    thc,
    signer,
    ({ solution, txHash }) => {}
  );

  async function onSubmitKey() {
    const address = await addressFromSolution(key);
    const index = addressToKeyIndex(address);
    if (index > -1) {
      const r = await submit(key);
      key = "";
      return r;
    } else {
      wrongAnswer = true;
      return false;
    }
  }

  function onCloseModal() {
    wrongAnswer = false;
    reset();
  }
</script>

{#if $fuckFuckFuckFuckFuck}
  <p>
    The game is br0ken, something happened to the storage. Reach out to our
    discord and ask for help or go to <a href="#/settings">Settings</a> and restart
    the game.
  </p>
{:else}
  <section class="thc--chapter">
    <p>
      Did you find a key? Submit it with this form to add it to your score in
      the leaderboard. More info in the <a href="#/about">FAQs</a>.
    </p>
    <form on:submit|preventDefault={() => onSubmitKey()}>
      <input placeholder="Key" bind:value={key} />
      <button disabled={key.length === 0} type="submit">Submit</button>
    </form>
  </section>
  {#if wrongAnswer}
    <div transition:fade class="thc--chapter-state">
      <div>
        <h2>Wrong answer</h2>
        <button on:click={() => onCloseModal()}>Try again</button>
      </div>
    </div>
  {/if}

  {#if $status !== undefined}
    <div transition:fade class="thc--chapter-state">
      <div>
        {#if $status === "ERROR"}
          <p>
            Something bad happened, get in contact with us, we can help you.
          </p>
          <pre>{$error}</pre>
        {:else}
          <h2>Correct Document</h2>
          {#if $status === "PENDING"}
            <p>Please wait some seconds because blockchains are fast.</p>
            <p>
              Keep this window open, wait, cross your fingers, don't enter any
              Faraday cage, don't drop your mobile phone in the toilet or in any
              other liquid, don't accept candies from strangers unless you are
              in Görlitzer Park, make sure you have enough battery left, don't
              lock your mobile phone.
            </p>
          {:else if $status === "SUCCESS"}
            <p>Your score has been updated.</p>
            <button on:click={onCloseModal}>Close</button>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
{/if}
