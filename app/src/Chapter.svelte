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
  let state = "idle";

  async function submit() {
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
    state = "check";
    try {
      const transaction = await $thc.functions.submit(v, r, s);
      console.log(transaction);
      state = "mine";
      const receipt = await $provider.waitForTransaction(transaction.hash);
      console.log("Transaction Mined: " + receipt.hash);
      console.log(receipt);
      $current.solution = solution;
      solution = "";
      state = "success";
    } catch (e) {
      state = "wrong";
    }
  }
</script>

<style>
  .solution {
    margin-top: var(--space-m);
  }

  .info {
    font-size: 0.8em;
    margin-top: 1000em;
  }
</style>

{#if state === 'check'}
  <h1 class="hope">Checking the solution</h1>
{:else if state === 'wrong'}
  <h1>Wrong solution :(</h1>
  <button class="primary" on:click={() => (state = 'idle')}>Try again</button>
{:else if state === 'mine'}
  <h1>Please wait for a few seconds</h1>
  <p>
    We are calculating the right trajectory to throw your answer into the
    blockchain. This might take up to 10 seconds.
  </p>
  <p>
    If it takes longer, there might be a network problem, try to reload the
    page.
  </p>
{:else if state === 'success'}
  <h1 class="hope">Congrats, you've solved the challenge!</h1>
  <h2>But you are not done yet.</h2>
  <button class="primary" on:click={() => (state = 'idle')}>
    Next Challenge
  </button>
{:else if $totalChapters && $currentQuest && $currentChapter}
  {#if $currentChapter !== undefined && $currentChapter.toString() === '0'}
    <p class="warning">
      This game stores the session in your browser (no cookie, no login, no
      recover password). Be aware that if you use incognito you might lose your
      progress.
    </p>
  {/if}
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
    <p class="info">
      <em>
        Are you stuck? Contact us at #6919, or
        <a href="https://twitter.com/dist0rtionproto">send us a message</a>
        .
      </em>
    </p>
  {/if}
{:else}
  <p>Loading... (Might take some time on old phones, like 30 seconds.)</p>
{/if}
