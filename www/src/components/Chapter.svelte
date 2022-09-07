<script lang="ts">
  import type { TreasureHuntCreator } from "../../../eth/typechain";
  import { signatureFromSolution } from "../lib";

  export let currentQuestHtml: string;
  export let currentChapter: number;
  export let totalChapters: number;
  export let address: string;
  export let thc: TreasureHuntCreator;
  export let lowBalance: boolean;
  export let onCorrectSolution: (v: string) => void;

  let solution = "";
  let state: "IDLE" | "CHECK" | "MINING" | "WRONG" | "SUCCESS" | "ERROR" =
    "IDLE";
  let error = "";

  async function submit() {
    state = "CHECK";
    try {
      const { r, s, v } = await signatureFromSolution(address, solution);
      const tx = await thc.submit(v, r, s);
      console.log(tx);
      state = "MINING";
      const receipt = await tx.wait();
      console.log("Transaction Mined: " + receipt);
      console.log(receipt);
      state = "SUCCESS";
    } catch (e: any) {
      console.log("error submitting solution", e);
      if (e.toString().toLowerCase().includes("execution failed")) {
        state = "WRONG";
      } else {
        state = "ERROR";
        error = e.toString();
      }
      return;
    }
    onCorrectSolution(solution);
  }
</script>

{#if currentChapter === 0}
  <div class="notification warning">
    This game stores the session in your browser (no cookie, no login, no
    recover password). Be aware that if you use incognito you might lose your
    progress.
  </div>
{/if}

<article>
  <section>
    {@html currentQuestHtml}
  </section>

  {#if lowBalance}
    <div class="notification warning">
      Your wallet is low in balance, refill <code>{address}</code> with some GörliETH.
    </div>
  {/if}

  {#if currentChapter !== totalChapters - 1}
    <form on:submit={submit}>
      <input
        disabled={lowBalance}
        placeholder="solution to the puzzle"
        bind:value={solution}
      />
      <button disabled={lowBalance || solution.length === 0} type="submit"
        >Submit</button
      >
    </form>
  {/if}
</article>
