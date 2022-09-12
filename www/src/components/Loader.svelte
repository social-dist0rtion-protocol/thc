<script lang="ts">
  import { fade } from "svelte/transition";
  export let fullscreen: boolean;
</script>

<div out:fade class:fullscreen>
  <span class="loader" />
</div>

<style>
  .fullscreen {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: black;
    z-index: 10;
  }

  .loader {
    position: relative;
    width: 100px;
    height: 100px;
  }

  .loader:before,
  .loader:after {
    content: "";
    border-radius: 50%;
    position: absolute;
    inset: 0;
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3) inset;
  }
  .loader:after {
    box-shadow: 0 2px 0 #0099ff inset;
    animation: rotate 2s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
