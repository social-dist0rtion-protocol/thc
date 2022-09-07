<script lang="ts">
  import {
    currentChapter,
    currentQuestHtml,
    totalChapters,
  } from "./stores/thc";

  let solution = "";
</script>

{#if $currentChapter === 0}
  <div class="notification warning">
    This game stores the session in your browser (no cookie, no login, no
    recover password). Be aware that if you use incognito you might lose your
    progress.
  </div>
{/if}

<article>
  <section>
    {@html $currentQuestHtml}
  </section>

  {#if $totalChapters !== null && $currentChapter !== $totalChapters - 1}
    <form>
      <input placeholder="solution to the puzzle" bind:value={solution} />
      <button type="submit">Submit</button>
    </form>
  {/if}
</article>
