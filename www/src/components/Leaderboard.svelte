<script lang="ts">
  import { ensAddressesRefresh, type ENSAddresses } from "../stores/thc";
  import { shortAddress } from "../lib";

  export let address: string;
  export let ensAddresses: ENSAddresses;
  export let leaderboard: {
    address: string;
    chapter: number;
    keys: (string | null)[];
  }[];
</script>

<div class="thc--notification">
  <p>
    <a href="#/about">Register</a> your ENS domain (<strong>on Görli!</strong>)
    to customize your
    <strong>username</strong>
    and
    <strong>avatar</strong>! Note: ENS names are refreshed every hour. You can
    also <button on:click={ensAddressesRefresh}>refresh manually</button> if you
    want.
  </p>
</div>

<table class="leaderboard">
  <thead>
    <tr>
      <td>Address</td>
      <td>Chapter</td>
      <td>Keys</td>
    </tr>
  </thead>
  <tbody>
    {#each leaderboard as { address: playerAddress, chapter, keys }}
      <tr>
        <td>
          {#if ensAddresses[playerAddress] && ensAddresses[playerAddress].avatar}
            <img
              class="avatar"
              src={ensAddresses[playerAddress].avatar}
              alt="Player's avatar"
            />
          {/if}
          {#if ensAddresses[playerAddress] && ensAddresses[playerAddress].ensName}
            <strong>
              {ensAddresses[playerAddress].ensName}
            </strong><br />
          {/if}
          <code>{shortAddress(playerAddress)}</code>
          {#if playerAddress.toLowerCase() === address.toLowerCase()}
            <br />
            <span class="label hope">that's you</span>
          {/if}
        </td>
        <td>{chapter}</td>
        <td>
          {#each keys as key}
            {#if key}
              🔑
            {:else}
              ❔
            {/if}
          {/each}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .avatar {
    width: 4rem;
  }
  img {
    max-width: 3rem;
    display: block;
  }
  button {
    display: inline;
    width: auto;
    padding: 0.2rem;
    font-size: inherit;
  }
</style>
