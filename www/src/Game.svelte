<script lang="ts">
  import {
    game,
    currentChapter,
    currentQuestHtml,
    lastTransactionMined,
    totalChapters,
    fuckFuckFuckFuckFuck,
  } from "./stores/thc";
  import Chapter from "./components/Chapter.svelte";
  import { prepareSubmitSolution } from "./lib";
  import { fade } from "svelte/transition";
  import Update from "./components/Update.svelte";

  import type { Signer } from "ethers";
  import type { TreasureHuntCreator } from "../../eth/typechain";

  export let signer: Signer;
  export let thc: TreasureHuntCreator;

  const { submit, status, txHash, error, reset } = prepareSubmitSolution(
    thc,
    signer,
    ({ solution, txHash }) => {
      const chapter = $currentChapter!.toString();
      $game[chapter].transactionHash = txHash;
      $game[chapter].solution = solution;
      $lastTransactionMined = txHash;
    }
  );

  function onCloseModal() {
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onQuestUpdatedConfirm() {
    if ($currentChapter !== null) {
      $game[$currentChapter.toString()].questHashLastSeen =
        $game[$currentChapter.toString()].questHash;
    }
  }

  let currentQuestUpdated = false;

  $: {
    currentQuestUpdated =
      $currentChapter !== null &&
      $game[$currentChapter.toString()] &&
      $game[$currentChapter.toString()].questHashLastSeen !==
        $game[$currentChapter.toString()].questHash;
  }
</script>

{#if $fuckFuckFuckFuckFuck}
  <p>
    The game is br0ken, something happened to the storage. Reach out to our
    discord and ask for help or go to <a href="#/settings">Settings</a> and restart
    the game.
  </p>
{:else if $currentChapter !== null && $currentQuestHtml !== null && $totalChapters !== null}
  <Chapter
    currentChapter={$currentChapter}
    currentQuestHtml={$currentQuestHtml}
    totalChapters={$totalChapters}
    onSubmitSolution={submit}
  />

  {#if $status !== undefined}
    <div transition:fade class="thc--chapter-state">
      <div>
        {#if $status === "WRONG"}
          <h2>Wrong answer</h2>
          <button on:click={reset}>Try again</button>
        {:else if $status === "ERROR"}
          <p>
            Something bad happened, get in contact with us, we can help you.
          </p>
          <pre>{$error}</pre>
        {:else}
          <h2>Correct answer</h2>
          {#if $status === "PENDING"}
            <p>Please wait some seconds because blockchains are fast.</p>
            <p>
              Keep this window open, wait, cross your fingers, don't enter any
              Faraday cage, don't drop your mobile phone in the toilet or in any
              other liquid, make sure you have enough battery left, don't lock
              your mobile phone.
            </p>
          {:else if $status === "SUCCESS"}
            <p>Your score has been updated.</p>
            <button on:click={onCloseModal}>Go to next chapter</button>
          {/if}
        {/if}
      </div>
    </div>
  {/if}

  {#if currentQuestUpdated}
    <Update {onQuestUpdatedConfirm} />
  {/if}
{/if}
