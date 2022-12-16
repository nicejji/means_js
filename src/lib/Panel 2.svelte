<script>
  import StartMenu from "./StartMenu.svelte";
  import IterMenu from "./IterMenu.svelte";

  export let labels
  export let centers
  export let colors
  export let statesCount
  export let isStarted
  export let selected

</script>

<div class="flex flex-col bg-zinc-600/20 w-fit z-10 gap-2 items-center p-2 absolute inset-0 text-white h-full overflow-hidden">
  {#if !isStarted}
    <span class="text-xl font-bold">KMeans 3D</span>
    <StartMenu on:start/>
  {:else}
    <IterMenu {labels} {centers} {colors} {statesCount} {selected} on:selectCenters on:restart/>
  {/if}
</div>
