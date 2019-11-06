<script>
  import { onMount } from 'svelte';
  import {wallet, currentQuest} from "./stores"
  import {push} from 'svelte-spa-router'
  import ethers from "ethers";

  let solution;

  onMount(async () => {
    //const current = await $thc.functions.currentQuest()
    //console.log(current);
  });

  async function submit() {
    const address = $wallet.address
    // Generate the hash of the value
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(solution));
    // Generate wallet using the 32 bytes from the hash
    const solutionWallet = new ethers.Wallet(hash)
    // Sign the raw bytes, not the hex string
    console.log("Address is:", solutionWallet.address);
    const signature = await solutionWallet.signMessage(ethers.utils.arrayify(address));
    const {r, s, v} = ethers.utils.splitSignature(signature);
    console.log(r, s, v);
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
