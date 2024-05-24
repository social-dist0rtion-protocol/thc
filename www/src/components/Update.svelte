<script lang="ts">
  export let onQuestUpdatedConfirm: () => void;
</script>

<div>
  <section>
    <p>This chapter has been updated, please give it another read 🙏</p>
    <button on:click={onQuestUpdatedConfirm}>OK I understand</button>
    <small
      >Please appreciate this button it's 3:27AM and I dunno why I'm focusing so
      much on it.</small
    >
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

  p {
    font-size: 1.2rem;
  }
  section {
    font-size: 2rem;
    text-align: center;
    width: 100%;
    max-width: var(--max-width);
    padding: 1rem;
    background-color: rgba(242, 245, 212, 0.9);
    box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.6);
  }

  small {
    font-size: 0.2rem;
  }

  button {
    padding: 2rem;
    background: rgb(0, 48, 92) url("ok-cat.png") no-repeat center right /
      contain;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }
</style>
