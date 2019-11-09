<script>
  import { onMount } from 'svelte';
  import {wallet, currentQuest, current, provider, thc} from "./stores"
  import {push} from 'svelte-spa-router'
  import ethers from "ethers";

  let solution;

  async function submit() {
    const address = $wallet.address;
    // Generate the hash of the value
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(solution));
    // Generate wallet using the 32 bytes from the hash
    const solutionWallet = new ethers.Wallet(hash);
    console.log(solutionWallet.address);
    // Sign the raw bytes, not the hex string
    const signature = await solutionWallet.signMessage(
      ethers.utils.arrayify(address)
    );
    const { r, s, v } = ethers.utils.splitSignature(signature);
    try {
      await $thc.functions.submit(v, r, s);
      current.update(d => d = {solution})
    } catch (e) {
      console.log(e);
    }
  }

</script>

<style>
  h1 {
    color: green;
  }
</style>

<h1>Hello {$wallet.address}!</h1>
{$currentQuest}

<input bind:value={solution}/>
<button on:click={submit}>submit</button>
