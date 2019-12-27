<script>
  import { onMount } from "svelte";
  import { wallet, currentQuest, current, provider, thc } from "./stores";
  import ethers from "ethers";
  import BN from "bn.js";

  async function load() {
    function parse(value) {
      const v = new BN(value.toString(), 10);
      const address = v.shrn(96).toString(16);
      const chapter = v.maskn(96).toNumber();
      const shortAddress =
        "0x" + address.substr(0, 4) + "…" + address.substr(16, 4);
      return { address: "0x" + address, shortAddress, chapter };
    }
    async function getLeaderboard() {
      const ZERO = ethers.utils.bigNumberify(0);
      const leaderboard = [];
      let page = 0;
      while (true) {
        const items = await $thc.functions.getLeaderboard(page);
        for (let item of items) {
          const value = ethers.utils.bigNumberify(item);
          if (value.eq(ZERO)) {
            return leaderboard;
          } else {
            leaderboard.push(parse(value));
          }
        }
        page++;
      }
    }

    const leaderboard = await getLeaderboard();
    leaderboard.sort((a, b) => b.chapter - a.chapter);
    return leaderboard;
  }
  load();
</script>

<style>

</style>

<h1>Leaderboard</h1>

{#await load()}
  <p>Loading...</p>
{:then values}
  <table class="leaderboard">
    <thead>
      <tr>
        <td>Address</td>
        <td>Chapter</td>
      </tr>
    </thead>
    <tbody>
      {#each values as value}
        <tr>
          <td>
            {value.shortAddress}
            {#if value.address.toLowerCase() === $wallet.address.toLowerCase()}
              <span class="label hope">that's you</span>
            {/if}
          </td>
          <td>{value.chapter}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{:catch error}
  <p>something went wrong. "{error.message}"</p>
{/await}
