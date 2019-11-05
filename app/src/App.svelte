<script>
  import {wallet, chainId} from "./stores"
  import {push} from 'svelte-spa-router'
  import ethers from "ethers";
  import THC from "./contracts/THC.json"

  let solution;

  async function submit() {
    const thc = new ethers.Contract(THC.networks[$chainId].address, THC.abi, $wallet);

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

<input bind:value={solution}/>
<button on:click={submit}>submit</button>
