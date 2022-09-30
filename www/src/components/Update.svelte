<script lang="ts">
  export let onQuestUpdatedConfirm: () => void;
</script>

<div>
  <section>
    <p>This chapter has been updated, please give it another read 🙏</p>
    <button on:click={onQuestUpdatedConfirm}>OK</button>
  </section>
</div>

<style>
  div {
    z-index: 1;
    position: fixed;
    bottom: 0.5rem;
    left: 0.5rem;
    right: 0.5rem;
    display: flex;
    justify-content: center;
  }

  section {
    text-align: center;
    width: 100%;
    max-width: var(--max-width);
    padding: 1rem;
    background-color: rgba(114, 38, 67, 0.9);
  }
</style>
