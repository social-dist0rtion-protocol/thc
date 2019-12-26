<script>
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
</style>

<article>
  <h1>Chapter 0</h1>
  {@html marked($currentQuest || '')}
</article>

<div class="solution">
  <input bind:value={solution} placeholder="solution to the puzzle" />
  <button class="primary" disabled={!solution.length} on:click={submit}>
    Submit
  </button>
</div>
