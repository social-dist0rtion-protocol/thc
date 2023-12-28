<script lang="ts">
  import { ethereumFaucetEndpoint } from "../stores/config";
  import { reloadBalanceTrigger } from "../stores/burnerWallet";

  export let currentQuestHtml: string;
  export let currentChapter: number;
  export let totalChapters: number;
  export let address: string;
  export let lowBalance: boolean;
  export let onSubmitSolution: (v: string) => Promise<boolean>;

  console.log("current", currentQuestHtml);

  let solution = "";

  let refillWalletStatus: null | "error" | "waiting" = null;

  async function refillWallet() {
    refillWalletStatus = "waiting";
    try {
      await fetch(`${ethereumFaucetEndpoint}/tokens?address=${address}`);
      $reloadBalanceTrigger = Date.now();
    } catch (e) {
      console.error(e);
      refillWalletStatus = "error";
    }
  }

  function onReset() {
    let sure = prompt(
      'WARNING: this action will reset your current game, type "yes" to confirm.'
    );

    if (sure === "yes") {
      localStorage.clear();
      window.location.reload();
    }
  }

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
    <p>
      <strong>
        The game uses a burner wallet and runs on the Sepolia test network,
        check your address in the <a href="#/settings">settings</a> page.
      </strong>
    </p>
  </div>
{/if}

<article class="thc--chapter">
  <section class="thc--chapter-text">
    {@html currentQuestHtml}
  </section>

  {#if lowBalance}
    <div class="thc--notification warning">
      <p>Your wallet is low in balance, refill it to play the game</p>
      {#if refillWalletStatus === "waiting"}
        <p>Please wait, it may take up to 15 seconds</p>
      {/if}
      {#if refillWalletStatus === "error"}
        <p>There was an error, please retry</p>
      {/if}
      <button disabled={refillWalletStatus !== null} on:click={refillWallet}
        >Refill Wallet (it's free!)</button
      >
    </div>
  {/if}

  {#if currentChapter !== totalChapters - 1}
    <form on:submit|preventDefault={onSubmit}>
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

<style>
  :global(img) {
    max-width: 100%;
  }
</style>
