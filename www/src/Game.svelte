<script lang="ts">
  import {
    currentChapter,
    currentQuestHtml,
    currentSolution,
    thc,
    totalChapters,
  } from "./stores/thc";
  import { lowBalance, signer } from "./stores/burnerWallet";
  import Chapter from "./components/Chapter.svelte";
  import { signatureFromSolution } from "./lib";
  import { fade } from "svelte/transition";

  let state: "IDLE" | "CHECK" | "MINING" | "SUCCESS" | "ERROR" = "IDLE";
  let error: string;

  // This function is called by the child component
  async function onSubmitSolution(solution: string) {
    const address = $signer!.address;
    const contract = $thc!;

    state = "CHECK";
    const { r, s, v } = await signatureFromSolution(address, solution);
    try {
      const tx = await contract.submit(v, r, s);
      console.log(tx);
      state = "MINING";
      const receipt = await tx.wait();
      console.log("Transaction Mined: " + receipt);
      console.log(receipt);
      state = "SUCCESS";
    } catch (e: any) {
      console.log("error submitting solution", e);
      state = "ERROR";
      error = e.toString();
      return;
    }
    $currentSolution = solution;
  }
</script>

{#if $signer !== null && $thc !== null && $currentChapter !== null && $currentQuestHtml !== null && $totalChapters !== null}
  <Chapter
    currentChapter={$currentChapter}
    currentQuestHtml={$currentQuestHtml}
    totalChapters={$totalChapters}
    address={$signer.address}
    lowBalance={$lowBalance}
    {onSubmitSolution}
  />

  {#if state !== "IDLE"}
    <div transition:fade class="fullscreen-notification">
      <div>
        {#if state === "CHECK"}
          <h2>Checking</h2>
          <p>Checking</p>
        {:else if state === "ERROR"}
          <p>
            Something bad happened, get in contact with us, we can help you.
          </p>
          <pre>{error}</pre>
        {:else}
          <h2>Correct answer</h2>
          <p>Please wait some seconds because blockchains are fast.</p>
          {#if state === "SUCCESS"}
            <p>Are you ready to continue with the next chapter?</p>
            <button on:click={() => (state = "IDLE")}>Of course</button>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
{/if}

<style>
  .fullscreen-notification {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
