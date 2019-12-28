<script>
  import { onMount } from "svelte";
  import { wallet, currentQuest, current, provider, thc } from "./stores";
  import ethers from "ethers";

  async function load() {
    async function getLeaderboard() {
      const ZERO = ethers.utils.bigNumberify(0);
      const leaderboard = [];
      let page = 0;
      while (true) {
        const items = await $thc.functions.getLeaderboard(page);
        for (let item of items) {
          const value = ethers.utils.bigNumberify(item);
          console.log(value);
          if (value.eq(ZERO)) {
            return leaderboard;
          } else {
            leaderboard.push(value);
          }
        }
        page++;
      }
    }

    function parse(value) {
      const address = value.shrn(96);
      //const chapter = value.
    }

    return getLeaderboard();
  }
  load();
</script>

<style>

</style>

<h1 class="hope">???</h1>

<p>
  Welcome to
  <span class="label hope">planetscape</span>
  , a decentralized treasure hunt built on IPFS and Ethereum.
</p>

<ul>
  <li>
    If you get stuck, send us a message
    <a href="https://twitter.com/dist0rtionproto">on Twitter</a>
    , call us at our DECT #6919, or visit us at
    <a href="https://36c3.c3nav.de/l/sdp/" target="_blank">
      the Social Dist0rtion Protocol assembly.
    </a>

  </li>
  <li>
    This game has been generated using
    <strong>THC</strong>
    (short for Treasure Hunt Creator), a free and open source tool to generate
    decentralzied treasure hunts using Ethereum and IPFS. Code is
    <a href="https://github.com/social-dist0rtion-protocol/thc">
      available on GitHub
    </a>
  </li>
</ul>
