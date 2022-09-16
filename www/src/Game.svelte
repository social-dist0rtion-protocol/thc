<script lang="ts">
  import {
    currentChapter,
    currentQuestHtml,
    currentSolution,
    lastTransactionMined,
    thc,
    totalChapters,
  } from "./stores/thc";
  import { lowBalance, signer } from "./stores/burnerWallet";
  import Chapter from "./components/Chapter.svelte";
  import { signatureFromSolution } from "./lib";
  import { fade } from "svelte/transition";

  let state: "IDLE" | "CHECK" | "MINING" | "SUCCESS" | "WRONG" | "ERROR" =
    "IDLE";
  let error: string;

  // This function is called by the child component
  async function onSubmitSolution(solution: string) {
    const address = $signer!.address;
    const contract = $thc!;
    solution = solution.toLowerCase();

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
      $lastTransactionMined = tx.hash;
      $currentSolution = solution;
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
            <p>Please wait few seconds because blockchains are fast.</p>
          {:else if state === "SUCCESS"}
            <p>Your score has been updated.</p>
            <button on:click={() => (state = "IDLE")}>Go to next chapter</button
            >
          {/if}
        {/if}
      </div>
    </div>
  {/if}
{/if}
