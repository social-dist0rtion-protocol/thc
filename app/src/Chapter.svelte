<script>
  import { onMount } from "svelte";
  import { wallet, currentQuest, current, provider, thc } from "./stores";
  import marked from "marked";
  import ethers from "ethers";

  let solution = "";

  async function submit() {
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
    } catch (e) {
      alert("The solution is not correct, try again");
      console.log(e);
    }
  }
</script>

<style>
  .solution {
    margin-top: var(--space-m);
  }

  input,
  button {
    display: block;
  }

  input {
    color: var(--color-hope);
    background: transparent;
    border: 2px solid var(--color-hope);
    width: 100%;
    padding: var(--space-s);
    margin-bottom: var(--space-s);
  }

  button {
    transition: background-color 0.2s;
    transform: rotate(-1.337deg);
    font-family: "Blackout 2 AM";
    font-weight: 500;
    font-size: 2em;
    width: 100%;
    padding: var(--space-s);
    background-color: var(--color-hope);
    border: none;
    color: var(--color-text);
  }

  button:disabled {
    background-color: gray;
  }
</style>

<article>
  <h1>Chapter 0</h1>
  {@html marked($currentQuest || '')}
</article>

<div class="solution">
  <input bind:value={solution} placeholder="solution to the puzzle" />
  <button disabled={!solution.length} on:click={submit}>Submit</button>
</div>
