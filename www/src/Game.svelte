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

  function onCorrectSolution(solution: string) {
    $currentSolution = solution;
  }
</script>

{#if $signer !== null && $thc !== null && $currentChapter !== null && $currentQuestHtml !== null && $totalChapters !== null}
  <Chapter
    currentChapter={$currentChapter}
    currentQuestHtml={$currentQuestHtml}
    totalChapters={$totalChapters}
    address={$signer.address}
    thc={$thc}
    lowBalance={$lowBalance}
    {onCorrectSolution}
  />
{/if}
