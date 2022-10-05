<script lang="ts">
  import { onMount } from "svelte";
  import { provider, address } from "./stores/burnerWallet";

  let location = "https://app.ens.domains";
  let newLocation = location;

  function onSubmit() {
    location = newLocation;
  }

  async function onMessage(e: MessageEvent) {
    if (
      !$address ||
      !$provider ||
      !e.source ||
      e.data?.env?.sdkVersion !== "6.2.0"
    ) {
      return;
    }

    const { id, method, params, txs } = e.data;
    let response: any;
    console.log("Got", e.data);

    if (method === "getSafeInfo") {
      response = {
        id: id,
        success: true,
        version: "7.8.0",
        data: {
          safeAddress: $address,
          network: "GOERLI",
          chainId: 5,
          owners: [$address],
          threshold: 1,
          isReadOnly: false,
        },
      };
    } else if (method === "rpcCall") {
      let success = true;
      let data: string = "0x";
      try {
        data = await $provider.send(params.call, params.params);
      } catch (e) {
        success = false;
        console.error(e);
      }
      response = {
        id,
        success,
        version: "7.8.0",
        data,
      };
    } else if (method === "sendTransactions") {
      const txs = [];
      for (const tx of params.txs) {
        console.log(tx);
        txs.push(await $provider.sendTransaction(tx));
      }
      console.log(txs);
      response = {
        id,
        success,
        version: "7.8.0",
        data: {},
      };
    }

    console.log("response", response);

    e.source.postMessage(response, e.origin);
  }

  onMount(() => {
    window.addEventListener("message", onMessage);
    () => window.removeEventListener("message", onMessage);
  });
</script>

<from on:submit|preventDefault={onSubmit}>
  <input bind:value={newLocation} />
  <button type="submit">Go</button>
</from>

<iframe title="Register your ENS domain" src={newLocation} frameborder="0" />

<style>
  iframe {
    width: 100%;
    height: 100vh;
  }
</style>
