<script lang="ts">
  import {
    game,
    currentChapter,
    currentQuestHtml,
    lastTransactionMined,
    thc,
    totalChapters,
    fuckFuckFuckFuckFuck,
  } from "./stores/thc";
  import { signer } from "./stores/burnerWallet";
  import Chapter from "./components/Chapter.svelte";
  import { signatureFromSolution } from "./lib";
  import { fade } from "svelte/transition";
  import Update from "./components/Update.svelte";
  import {
    GelatoRelay,
    type CallWithSyncFeeERC2771Request,
  } from "@gelatonetwork/relay-sdk";

  let state: "IDLE" | "CHECK" | "MINING" | "SUCCESS" | "WRONG" | "ERROR" =
    "IDLE";
  let error: string;
  $: sign = $signer;

  // This function is called by the child component
  async function onSubmitSolution(solution: string) {
    const address = await $signer!.getAddress();
    const contract = $thc!;
    const chapterNumber = $currentChapter!;
    solution = solution.toLowerCase();
    state = "CHECK";
    const { r, s, v } = await signatureFromSolution(address, solution);
    // Store the solution, if it's wrong it's not a problem since it won't be
    // used
    $game[chapterNumber.toString()].solution = solution;
    try {
      // const tx = await contract.submit(v, r, s);
      const { data } = await contract.submit.populateTransaction(v, r, s);

      const relay = new GelatoRelay();
      const request: CallWithSyncFeeERC2771Request = {
        chainId: BigInt(11155111),
        target: "0xC957945F761747CBe06e99388C8B9206138170b7",
        data: data!,
        user: address,
        feeToken: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
        isRelayContext: true,
      };

      const relayResponse = await relay.callWithSyncFeeERC2771(request, sign!);
      console.log(relayResponse);

      /*
      console.log(tx);
      state = "MINING";
      const receipt = await tx.wait();
      console.log("Transaction Mined: " + receipt);
      console.log(receipt);
      state = "SUCCESS";
      $lastTransactionMined = tx.hash;
      $game[chapterNumber.toString()].transactionHash = tx.hash;
      */
      return true;
    } catch (e: any) {
      const msg = e.toString() as string;
      if (msg.toLowerCase().includes("wrong solution")) {
        state = "WRONG";
      } else {
        console.log("error submitting solution", e);
        state = "ERROR";
        error = e.toString();
      }
      return false;
    }
  }

  function onCloseModal() {
    state = "IDLE";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onQuestUpdatedConfirm() {
    if ($currentChapter !== null) {
      $game[$currentChapter.toString()].questHashLastSeen =
        $game[$currentChapter.toString()].questHash;
    }
  }

  let currentQuestUpdated = false;

  $: {
    currentQuestUpdated =
      $currentChapter !== null &&
      $game[$currentChapter.toString()] &&
      $game[$currentChapter.toString()].questHashLastSeen !==
        $game[$currentChapter.toString()].questHash;
  }
</script>

{#if $fuckFuckFuckFuckFuck}
  <p>
    The game is br0ken, something happened to the storage. Reach out to our
    discord and ask for help or go to <a href="#/settings">Settings</a> and restart
    the game.
  </p>
{:else if $signer !== null && $thc !== null && $currentChapter !== null && $currentQuestHtml !== null && $totalChapters !== null}
  <Chapter
    currentChapter={$currentChapter}
    currentQuestHtml={$currentQuestHtml}
    totalChapters={$totalChapters}
    {onSubmitSolution}
  />

  {#if state !== "IDLE"}
    <div transition:fade class="thc--chapter-state">
      <div>
        {#if state === "CHECK"}
          <h2>Checking</h2>
          <p>Checking</p>
        {:else if state === "WRONG"}
          <h2>Wrong answer</h2>
          <button on:click={() => (state = "IDLE")}>Try again</button>
        {:else if state === "ERROR"}
          <p>
            Something bad happened, get in contact with us, we can help you.
          </p>
          <pre>{error}</pre>
        {:else}
          <h2>Correct answer</h2>
          {#if state === "MINING"}
            <p>Please wait some seconds because blockchains are fast.</p>
            <p>
              Keep this window open, wait, cross your fingers, don't enter any
              Faraday cage, don't drop your mobile phone in the toilet or in any
              other liquid, make sure you have enough battery left, don't lock
              your mobile phone.
            </p>
          {:else if state === "SUCCESS"}
            <p>Your score has been updated.</p>
            <button on:click={onCloseModal}>Go to next chapter</button>
          {/if}
        {/if}
      </div>
    </div>
  {/if}

  {#if currentQuestUpdated}
    <Update {onQuestUpdatedConfirm} />
  {/if}
{/if}
