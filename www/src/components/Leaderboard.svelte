<script lang="ts">
  import { shortAddress } from "../lib";

  export let address: string;
  export let leaderboard: { address: string; chapter: number }[];
</script>

<table class="leaderboard">
  <thead>
    <tr>
      <td>Address</td>
      <td>Chapter</td>
    </tr>
  </thead>
  <tbody>
    {#each leaderboard as { address: playerAddress, chapter }}
      <tr>
        <td>
          {shortAddress(playerAddress)}
          {#if playerAddress.toLowerCase() === address.toLowerCase()}
            <span class="label hope">that's you</span>
          {/if}
        </td>
        <td>{chapter}</td>
      </tr>
    {/each}
  </tbody>
</table>
