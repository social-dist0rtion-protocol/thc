<script lang="ts">
  export let currentQuestHtml: string;
  export let currentChapter: number;
  export let totalChapters: number;
  export let address: string;
  export let lowBalance: boolean;
  export let onSubmitSolution: (v: string) => Promise<boolean>;

  let solution = "";

  async function onSubmit() {
    if (await onSubmitSolution(solution)) {
      solution = "";
    }
  }
</script>

{#if currentChapter === 0}
  <div class="thc--notification warning">
    <p>
      This game stores the session in your browser (no cookie, no login, no
      recover password). Be aware that if you use incognito you might lose your
      progress.
    </p>
  </div>
{/if}

<article class="thc--chapter">
  <section class="thc--chapter-text">
    {@html currentQuestHtml}
  </section>

  {#if currentChapter !== totalChapters - 1}
    <form on:submit={onSubmit}>
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

  {#if lowBalance}
    <div class="thc--notification warning">
      <p>
        Your wallet is low in balance, refill <code>{address}</code> with some GörliETH.
      </p>
    </div>
  {/if}
</article>
