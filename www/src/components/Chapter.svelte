<script lang="ts">
  export let currentQuestHtml: string;
  export let currentChapter: number;
  export let totalChapters: number;
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
      password recovery). Be aware that if you use incognito you might lose your
      progress.
    </p>
    <p>
      The game uses a burner wallet and runs on the Optimism network. All
      transactions are sponsored by us using gelato.network. Check your address
      in the <a href="#/settings">settings</a> page.
    </p>
  </div>
{/if}

<article class="thc--chapter">
  <section class="thc--chapter-text">
    {@html currentQuestHtml}
  </section>

  {#if currentChapter !== totalChapters - 1}
    <form on:submit|preventDefault={onSubmit}>
      <input placeholder="solution to the puzzle" bind:value={solution} />
      <button disabled={solution.length === 0} type="submit">Submit</button>
    </form>
  {/if}
</article>

<style>
  :global(img) {
    max-width: 100%;
  }
</style>
