<script>
  import { fade } from "svelte/transition";
  import { selectedState } from "../stores";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let labels
  export let centers
  export let colors
  export let statesCount
  export let selected

  const resolveStatus = (cur, end) => {
    if (cur === 0) return "Initialized centers"
    if (cur === 1) return "Calculated labels"
    if (cur > end - 2) return "Centers not changed, ending..."
    return cur % 2 ? "Updated labels" : "Moved centroids"
  }
  $: status = resolveStatus($selectedState, statesCount)
</script>

<div class="flex flex-col text-white p-3 gap-2 h-full">
  <p class="font-bold">{`Iteration: ${Math.round($selectedState / 2)}`}</p>
  <p class="text-s">{status}</p>
  <input class="w-72 bg-red-800"
    type="range" min={0} max={statesCount - 1} bind:value={$selectedState}>
  <hr>
    <div class="overflow-scroll flex flex-col h-full gap-2">
    <span class="text-xs text-zinc-400">Click on center to watch connections</span>
    {#each centers as c, i}
      <div 
        class={"flex flex-col hover:bg-zinc-700 cursor-default " + (selected[i] ? "bg-zinc-600" : "")}
        on:click={() => {dispatch('selectCenters', i)}}>
      <div class="w-full h-2" style={`background-color: ${colors[i]}`}></div>
        <p class="text-s">
          <span class="font-bold italic">{`Center ${i}`}</span>
          <span in:fade>{`${labels.reduce((n, val) => n + (val === i), 0)} points`}</span>
        </p>
        <p class="text-xs">{`x: ${c[0].toFixed(2)} y: ${c[1].toFixed(2)} z: ${c[2].toFixed(2)}`}</p>
      </div>
    {/each}
    </div>
    <button class="bg-blue-600 p-3" on:click={() => dispatch('restart', 1)}>Restart</button>
</div>
