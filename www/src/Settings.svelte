<script lang="ts">
  import { formatEther } from "ethers/lib/utils";
  import QRCode from "qrcode";
  import { onMount } from "svelte";

  import { signer, balance, mnemonic } from "./stores/burnerWallet";
  import { thc, currentSolution } from "./stores/thc";

  let reveal = false;
  let canvas: HTMLCanvasElement;

  let changeMnemonic: string;
  let restoreMnemonic: string;
  let restoreCurrentSolution: null | string = null;

  onMount(() => {
    QRCode.toCanvas(canvas, `ethereum:${$signer!.address}`, {
      width: 200,
    });
  });

  async function onChangeMnemonic() {
    let sure = prompt(
      'WARNING: this action will reset your current game, type "yes" to confirm.'
    );

    if (sure === "yes") {
      localStorage.clear();
      $mnemonic = changeMnemonic;
      window.location.reload();
    }
  }

  async function onRestoreGame() {
    let sure = prompt(
      'WARNING: this action will reset your current game, type "yes" to confirm.'
    );

    if (sure === "yes") {
      localStorage.clear();
      $mnemonic = restoreMnemonic;
      $currentSolution = restoreCurrentSolution;
      window.location.reload();
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
</script>

<h1>Settings</h1>

<h2>Wallet address</h2>

<p class="scroll">
  {$signer ? $signer.address : "loading…"}
</p>

<canvas bind:this={canvas} />

<h2>Wallet balance</h2>

<p>
  {$balance ? formatEther($balance) + " Ether" : "loading…"}
</p>

<h2>Network</h2>

<p>Görli</p>

<h2>Smart Contract</h2>

<p class="scroll">
  {#if $thc}
    <a href="https://goerli.etherscan.io/address/{$thc.address}"
      >{$thc.address}</a
    >
  {:else}
    loading…
  {/if}
</p>

<h2>Change Seedphrase</h2>

<form on:submit|preventDefault={onChangeMnemonic}>
  <label>
    Mnemonic
    <textarea bind:value={changeMnemonic} />
  </label>
  <button type="submit">Change</button>
</form>

<h2>Mnemonic and game secret</h2>

{#if !reveal}
  <button on:click={() => (reveal = true)}>Reveal secrets</button>
{:else}
  <label>
    Mnemonic
    <textarea readonly>{$mnemonic}</textarea>
  </label>
  <label>
    Last Solution
    <input readonly value={$currentSolution} />
  </label>
{/if}

<h2>Restore game</h2>

<form on:submit|preventDefault={onRestoreGame}>
  <label>
    Mnemonic
    <textarea bind:value={restoreMnemonic} />
  </label>
  <label>
    Last Solution
    <input bind:value={restoreCurrentSolution} />
  </label>
  <button type="submit">Restore</button>
</form>

<h2>Reset</h2>

<p>Reset the current session, you'll start from Chapter 0 again</p>

<button on:click={onReset}>Reset game</button>

<style>
  .scroll {
    overflow-x: auto;
  }

  h2 {
    margin-top: 4rem;
  }
</style>
