<script lang="ts">
  export let currentQuestHtml: string;
  export let currentChapter: number;
  export let totalChapters: number;
  export let address: string;
  export let lowBalance: boolean;
  export let onSubmitSolution: (v: string) => void;

  let solution = "";
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
    <form on:submit={() => onSubmitSolution(solution)}>
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
