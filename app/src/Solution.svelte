<script>
  import {provider, wallet} from "./stores"
  import {push} from 'svelte-spa-router'
  import ethers from "ethers";
  import thc from "./contracts/TreasureHuntCreator.json";

  export let params = {}

  async function submit() {
    const address = $wallet.address
    // Generate the hash of the value
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(params.message));
    // Generate wallet using the 32 bytes from the hash
    const solution = new ethers.Wallet(hash)
    // Sign the raw bytes, not the hex string
    console.log("Address is:", solution.address);
    const signature = await solution.signMessage(ethers.utils.arrayify(address));
    const {r, s, v} = ethers.utils.splitSignature(signature);
    const contract = new ethers.Contract(thc.networks[$provider.network.chainId].address, thc.abi, $wallet);
    await contract.functions.join()
    console.log(await contract.functions.submit(v, r, s));
  }
</script>

<style>
  h1 {
    color: tomato;
  }
</style>

<h1>{params.message}</h1>

<button on:click={submit}>scan</button>
