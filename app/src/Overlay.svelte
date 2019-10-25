<script>
  export let closeHandler;
</script>

<style>
  article {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<article>
  <slot />
</article>

