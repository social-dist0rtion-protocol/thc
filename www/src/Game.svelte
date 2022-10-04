<script lang="ts">
  import {
    game,
    currentChapter,
    currentQuestHtml,
    currentQuestHash,
    lastTransactionMined,
    thc,
    totalChapters,
    fuckFuckFuckFuckFuck,
  } from "./stores/thc";
  import { lowBalance, signer } from "./stores/burnerWallet";
  import Chapter from "./components/Chapter.svelte";
  import { signatureFromSolution } from "./lib";
  import { fade } from "svelte/transition";
  import Update from "./components/Update.svelte";

  let state: "IDLE" | "CHECK" | "MINING" | "SUCCESS" | "WRONG" | "ERROR" =
    "IDLE";
  let error: string;

  // This function is called by the child component
  async function onSubmitSolution(solution: string) {
    const address = $signer!.address;
    const contract = $thc!;
    const chapterNumber = $currentChapter!;
    solution = solution.toLowerCase();

    state = "CHECK";
    const { r, s, v } = await signatureFromSolution(address, solution);
    // Store the solution, if it's wrong it's not a problem since it won't be
    // used
    $game[chapterNumber.toString()].solution = solution;
    $game[(chapterNumber + 1).toString()] = {
      solution: null,
      questHash: null,
      transactionHash: null,
    };
    try {
      const tx = await contract.submit(v, r, s);
      console.log(tx);
      state = "MINING";
      const receipt = await tx.wait();
      console.log("Transaction Mined: " + receipt);
      console.log(receipt);
      state = "SUCCESS";
      $lastTransactionMined = tx.hash;
      $game[chapterNumber.toString()].transactionHash = tx.hash;
      return true;
    } catch (e: any) {
      const msg = e.toString() as string;
      if (msg.toLowerCase().includes("wrong solution")) {
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
    state = "IDLE";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onQuestUpdatedConfirm() {
    if ($currentChapter !== null) {
      $game[$currentChapter.toString()].questHash !== $currentQuestHash;
    }
  }

  let currentQuestUpdated = false;

  $: {
    if (
      $currentChapter !== null &&
      $game[$currentChapter] &&
      $game[$currentChapter].questHash === null
    ) {
      $game[$currentChapter.toString()].questHash = $currentQuestHash;
      currentQuestUpdated =
        $game[$currentChapter.toString()].questHash !== $currentQuestHash;
    }
  }
</script>

{#if $fuckFuckFuckFuckFuck}
  <p>
    The game is br0ken, something happened to the storage. Reach out to our
    discord and ask for help or go to <a href="#/settings">Settings</a> and restart
    the game.
  </p>
{:else if $signer !== null && $thc !== null && $currentChapter !== null && $currentQuestHtml !== null && $totalChapters !== null}
  <Chapter
    currentChapter={$currentChapter}
    currentQuestHtml={$currentQuestHtml}
    totalChapters={$totalChapters}
    address={$signer.address}
    lowBalance={$lowBalance}
    {onSubmitSolution}
  />

  {#if state !== "IDLE"}
    <div transition:fade class="thc--chapter-state">
      <div>
        {#if state === "CHECK"}
          <h2>Checking</h2>
          <p>Checking</p>
        {:else if state === "WRONG"}
          <h2>Wrong answer</h2>
          <button on:click={() => (state = "IDLE")}>Try again</button>
        {:else if state === "ERROR"}
          <p>
            Something bad happened, get in contact with us, we can help you.
          </p>
          <pre>{error}</pre>
        {:else}
          <h2>Correct answer</h2>
          {#if state === "MINING"}
            <p>Please wait some seconds because blockchains are fast.</p>
            <p>
              We didn't have time to do proper error handling (lol), and we hope
              you won't get any network error. Keep this window open, wait,
              cross your fingers, don't enter any Faraday cage, don't drop your
              mobile phone in the toilet or in any other liquid, make sure you
              have enough battery left, don't lock your mobile phone.
            </p>
          {:else if state === "SUCCESS"}
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
