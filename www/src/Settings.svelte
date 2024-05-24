<script lang="ts">
  import { formatEther } from "ethers";
  import QRCode from "qrcode";
  import { onMount } from "svelte";

  import { signer, mnemonic } from "./stores/burnerWallet";
  import { thc, game } from "./stores/thc";

  let reveal = false;
  let canvas: HTMLCanvasElement;

  let changeMnemonic: string;
  let restoreMnemonic: string;
  let restoreGame: null | string = null;

  let dump = localStorage.getItem("dump") || "";

  onMount(async () => {
    QRCode.toCanvas(canvas, `ethereum:${await $signer!.getAddress()}`, {
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
      try {
        if (restoreGame) {
          $game = JSON.parse(window.atob(restoreGame));
        } else {
          $game = {};
        }
      } catch (e) {
        alert("There was an error importing the game. Please try again.");
        localStorage.clear();
        return;
      }
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
  {#if $signer}
    {#await $signer.getAddress() then addr}
      {addr}
    {/await}
  {/if}
</p>

<canvas bind:this={canvas} />

<h2>Network</h2>

<p>Optimism</p>

<h2>Smart Contract</h2>

<p class="scroll">
  {#if $thc}
    {#await $thc.getAddress() then addr}
      <a href="https://optimistic.etherscan.io/address/{addr}">{addr}</a>
    {/await}
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
    Game State
    <input readonly value={window.btoa(JSON.stringify($game))} />
  </label>
{/if}

<h2>Restore game</h2>

<form on:submit|preventDefault={onRestoreGame}>
  <label>
    Mnemonic
    <textarea bind:value={restoreMnemonic} />
  </label>
  <label>
    Game State
    <input bind:value={restoreGame} />
  </label>
  <button type="submit">Restore</button>
</form>

<h2>Reset</h2>

<p>Reset the current session, you'll start from Chapter 0 again</p>

<button on:click={onReset}>Reset game</button>

<h2>Ver</h2>

<pre>5</pre>

<details>
  <summary>Debug</summary>
  <pre style="font-size: 0.6rem">{dump}</pre>
</details>

<style>
  .scroll {
    overflow-x: auto;
  }

  h2 {
    margin-top: 4rem;
  }
</style>
