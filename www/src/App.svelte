<script lang="ts">
  import Router from "svelte-spa-router";

  import Header from "./components/Header.svelte";
  import { routes } from "./routes";
  import { address } from "./stores/burnerWallet";

  address.subscribe(() => {
    console.log("Address cached");
  });
</script>

<Header />

<main>
  <Router {routes} />
</main>
