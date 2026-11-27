<script lang="ts">
  const FULL_TEXT = "Transforming Ideas into Digital Solutions";
  const HIGHLIGHTED_TEXT = "Digital Solutions";

  let displayedText = $state("");

  $effect(() => {
    if (displayedText.length < FULL_TEXT.length) {
      const timeout = setTimeout(() => {
        displayedText = FULL_TEXT.substring(0, displayedText.length + 1);
      }, 50); // Speed of typing
      return () => clearTimeout(timeout);
    }
  });

  // Split text to highlight the last part
  const regularText = $derived(
    displayedText.substring(
      0,
      displayedText.length - HIGHLIGHTED_TEXT.length,
    ),
  );
  const highlightedPart = $derived(
    displayedText.substring(displayedText.length - HIGHLIGHTED_TEXT.length),
  );
</script>

<div class="h-24 md:h-32 mb-6">
  <h1 class="text-4xl md:text-5xl font-bold h-full flex items-center">
    <span>
      {regularText}
      {#if highlightedPart}
        <span class="text-primary">{highlightedPart}</span>
      {/if}
      {#if displayedText.length < FULL_TEXT.length}
        <span class="text-primary animate-caret">|</span>
      {/if}
      {#if displayedText.length === 0}
        <span class="invisible">{FULL_TEXT}</span>
      {/if}
    </span>
  </h1>
</div>

<style>
  @keyframes caret-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  .animate-caret {
    animation: caret-blink 0.8s ease-in-out infinite;
  }
</style>
