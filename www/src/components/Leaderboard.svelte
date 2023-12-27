<script lang="ts">
  import { ensAddressesRefresh, type ENSAddresses } from "../stores/thc";
  import { shortAddress } from "../lib";
  import * as blockies from "blockies-ts";

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
    <a href="#/about">Register</a> your ENS domain (<strong>on Sepolia!</strong
    >) to customize your
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
      <td />
      <td>Address</td>
      <td>Chapter</td>
      <td>Keys</td>
    </tr>
  </thead>
  <tbody>
    {#each leaderboard as { address: playerAddress, chapter, keys }}
      <tr>
        <td class="avatar">
          {#if ensAddresses[playerAddress] && ensAddresses[playerAddress].avatar}
            <img
              src={ensAddresses[playerAddress].avatar}
              alt="Player's avatar"
            />
          {:else}
            <img
              src={blockies.create({ seed: playerAddress }).toDataURL()}
              alt="Player's avatar"
            />
          {/if}
        </td>

        <td class="ensname">
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
        <td class="keys">
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
    width: 2rem;
    padding-right: 0.2rem;
  }
  img {
    width: 2rem;
    max-width: 2rem;
    display: block;
  }
  button {
    display: inline;
    width: auto;
    padding: 0.2rem;
    font-size: inherit;
  }
  table {
    border-collapse: separate;
    border-spacing: 0 1.2rem;
  }
  .keys {
    font-size: 0.8rem;
  }
  .ensname {
  }
  .ensname strong {
    max-width: 7rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
</style>
