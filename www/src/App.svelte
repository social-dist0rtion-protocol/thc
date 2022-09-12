<script lang="ts">
  import Router from "svelte-spa-router";

  import Header from "./components/Header.svelte";
  import Loader from "./components/Loader.svelte";
  import { routes } from "./routes";
  import { address } from "./stores/burnerWallet";
</script>

{#if !$address}
  <Loader fullscreen />
{:else}
  <Header />

  <main>
    <Router {routes} />
  </main>

  <footer />
{/if}
