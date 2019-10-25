<script>
  import {wallet} from "./stores"
  import {push} from 'svelte-spa-router'
  import ethers from "ethers";
  import QRCode from "./QRCode.svelte"

  let scanner = false;

  function onValue(value) {
    push(`/solution/${value}`)
  }

  function onClose() {
    scanner = false;
  }

</script>

<style>
  h1 {
    color: tomato;
  }
</style>

<h1>Hello {$wallet.address}!</h1>

  {#if scanner}
    <QRCode {onValue} {onClose} />
  {/if}

<button on:click={() => scanner=true}>scan</button>
