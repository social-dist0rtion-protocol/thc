<script>
  import {
    wallet,
    mnemonic,
    network,
    currentQuest,
    current,
    provider,
    thc,
    balance
  } from "./stores";
  import ethers from "ethers";

  let reveal = false;
  let newMnemonic = "";

  function onReveal() {
    reveal = true;
  }

  async function onRestore() {
    newMnemonic = prompt("WARNING: this action will replace the old mnemonic");
    let sure = prompt('Type "yes" to save the new mnemonic');

    if (sure === "yes") {
      $mnemonic = newMnemonic;
    }
  }

  async function onReset() {
    let sure = prompt('Type "yes" reset the game');

    if (sure === "yes") {
      localStorage.clear();
      window.location.reload();
    }
  }
</script>

<h1 class="hope">Settings</h1>

<h2 class="hope">Wallet address</h2>

<p>{$wallet.address}</p>

<h2 class="hope">Wallet balance</h2>

<p>
  {$balance === undefined ? 'loading' : ethers.utils.formatEther($balance)}
  Ether
</p>

<h2 class="hope">Network</h2>

<p>{$network}</p>

<h1>/!\ Danger zone /!\</h1>

<p>Be careful, you can break things here.</p>

<h2>Mnemonic</h2>
<p>
  The mnemonic passphrase is used to generate the wallet. You should save it
  somewhere.
</p>

{#if !reveal}
  <button on:click={onReveal}>Reveal mnemonic</button>
{:else}
  <textarea readonly>{$mnemonic}</textarea>
{/if}

<p>
  You can also restore another mnemonic if you want. Beware you'll lose the old
  one.
</p>
<button on:click={onRestore}>Restore mnemonic</button>

<h2>Reset</h2>

<p>Reset the current session, you'll start from Chapter 0 again</p>

<button on:click={onReset}>Reset game</button>
