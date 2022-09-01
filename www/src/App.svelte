<script lang="ts">
  import Header from "./Header.svelte";
  import { init } from "./stores/wallet";

  const initializing = init();
</script>

{#await initializing}
  <p>Loading please wait…</p>
{:then}
  <header>
    <Header />
  </header>
  <main>hello</main>
{:catch}
  <p>There was an error loading the page.</p>
{/await}

<style>
  main {
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  p {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }
</style>
