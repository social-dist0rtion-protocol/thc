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
  import {
    addressFromSolution,
    addressToChapterIndex,
    pollGelatoTaskId,
    prepareSubmitSolution,
  } from "./lib";
  import { fade } from "svelte/transition";
  import Update from "./components/Update.svelte";

  import type { Signer } from "ethers";
  import type { TreasureHuntCreator } from "../../eth/typechain";

  export let signer: Signer;
  export let thc: TreasureHuntCreator;
  let wrongAnswer: boolean;

  const { submit, status, error, reset } = prepareSubmitSolution(
    thc,
    signer,
    ({ solution, txHash }) => {
      const chapter = $currentChapter!.toString();
      console.log("store game", chapter, solution, txHash);
      $game[chapter].transactionHash = txHash;
      $game[chapter].solution = solution;
      $lastTransactionMined = txHash;
      console.log("state", $game);
    }
  );

  function onCloseModal(scrollToTop?: boolean) {
    reset();
    wrongAnswer = false;
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function onQuestUpdatedConfirm() {
    if ($currentChapter !== null) {
      $game[$currentChapter.toString()].questHashLastSeen =
        $game[$currentChapter.toString()].questHash;
    }
  }

  async function onSubmitSolution(solution: string) {
    console.log("sol", solution, $currentChapter);
    if ($currentChapter === null) return false;
    const address = await addressFromSolution(solution);
    console.log("address", address);
    console.log(addressToChapterIndex(address));

    if (addressToChapterIndex(address) === $currentChapter) {
      localStorage.setItem(`solution:${$currentChapter}`, solution);
      localStorage.setItem(`solution:${$currentChapter}:status`, "SUBMITTED");
      const result = await submit(solution);
      localStorage.setItem(`solution:${$currentChapter}:status`, "CONFIRMED");
      return result;
    } else {
      wrongAnswer = true;
      return false;
    }
  }

  let currentQuestUpdated = false;

  const gelatoTaskId = localStorage.getItem("gelatoTaskId");
  const gelatoTxHash = localStorage.getItem("gelatoTxHash");

  if (gelatoTaskId !== null && gelatoTxHash === null) {
    status.set("PENDING");
    pollGelatoTaskId(gelatoTaskId).then((txHash) => {
      if (txHash === null) {
        // resubmit
        status.set("ERROR");
      } else {
        const solution = localStorage.getItem("gelatoSolution");
        const chapter = $currentChapter!.toString();
        console.log("store game", chapter, solution, txHash);
        $game[chapter].transactionHash = txHash;
        $game[chapter].solution = solution;
        $lastTransactionMined = txHash;
        console.log("state", $game);
        status.set("SUCCESS");
      }
      localStorage.removeItem("gelatoTaskId");
      localStorage.removeItem("gelatoTxHash");
      localStorage.removeItem("gelatoSolution");
    });
  }

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
    {onSubmitSolution}
  />

  {#if wrongAnswer}
    <div transition:fade class="thc--chapter-state">
      <div>
        <h2>Wrong answer</h2>
        <button on:click={() => onCloseModal(false)}>Try again</button>
      </div>
    </div>
  {/if}

  {#if $status !== undefined}
    <div transition:fade class="thc--chapter-state">
      <div>
        {#if $status === "ERROR"}
          <p>
            Something bad happened 🤕 get in contact with us, we can help you.
          </p>
          <pre>{$error}</pre>
        {:else}
          <h2>Correct answer</h2>
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
            <button on:click={() => onCloseModal()}>Go to next chapter</button>
          {/if}
        {/if}
      </div>
    </div>
  {/if}

  {#if currentQuestUpdated}
    <Update {onQuestUpdatedConfirm} />
  {/if}
{/if}
