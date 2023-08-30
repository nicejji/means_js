<script lang="ts">
  export let value: number;
  export let min: number;
  export let max: number;
</script>

<input
  class="appearance-none bg-transparent cursor-pointer [&::-webkit-slider-runnable-track]:bg-highlight-med [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-text [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:aspect-square [&::-webkit-slider-thumb]:rounded-lg"
  {min}
  {max}
  type="range"
  bind:value
/>
