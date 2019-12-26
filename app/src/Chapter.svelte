<script>
  import {
    wallet,
    balance,
    fundRequest,
    totalChapters,
    currentQuest,
    currentChapter,
    current,
    provider,
    thc
  } from "./stores";
  import CONFIG from "./config";
  import marked from "marked";
  import ethers from "ethers";

  let solution = "";

  async function submit() {
    console.log("asdf", $currentChapter.toString());
    if ($currentChapter.toString() === "0") {
      //await requestFunds();
    }
    solution = solution.toLowerCase();
    const address = $wallet.address;
    // Generate the hash of the value
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(solution));
    // Generate wallet using the 32 bytes from the hash
    const solutionWallet = new ethers.Wallet(hash);
    // Sign the raw bytes, not the hex string
    const signature = await solutionWallet.signMessage(
      ethers.utils.arrayify(address)
    );
    const { r, s, v } = ethers.utils.splitSignature(signature);
    try {
      await $thc.functions.submit(v, r, s);
      $current.solution = solution;
      solution = "";
    } catch (e) {
      alert("The solution is not correct, try again");
    }
  }
</script>

<style>
  .solution {
    margin-top: var(--space-m);
  }
</style>

{#if $totalChapters && $currentQuest && $currentChapter}
  <article>
    <h1>Chapter {$currentChapter}</h1>
    {@html marked($currentQuest)}
  </article>
  {#if $totalChapters.toNumber() - 1 !== $currentChapter.toNumber()}
    <div class="solution">
      <input bind:value={solution} placeholder="solution to the puzzle" />
      {#if $fundRequest === undefined && solution.length}
        <p class="warning">
          You have to wait a bit more before submitting your first solution, the
          game is not fully initialized yet. If you wonder why, check the
          <a href="#/about">about page</a>
        </p>
      {/if}
      <button class="primary" disabled={!solution.length} on:click={submit}>
        Submit
      </button>
    </div>
  {/if}
{:else}
  <p>loading...</p>
{/if}
