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
  <span class="font-bold">{`Iteration: ${Math.round($selectedState / 2)}`}</span>
  <span class="text-s">{status}</span>
  <input class="w-72 bg-red-800"
    type="range" min={0} max={statesCount - 1} bind:value={$selectedState} list="tickmarks">
  <datalist id="tickmarks">
    {#each [...Array(statesCount).keys()] as i}
      <option>{i}</option>
    {/each}
  </datalist>
  <hr>
  <span class="text-xs text-zinc-400">Click on center to watch connections</span>
  <div class="overflow-scroll flex flex-col h-full gap-2">
    {#each centers as c, i}
      <div 
      class={"flex flex-col px-2 hover:bg-zinc-700 cursor-default " + (selected[i] ? "bg-zinc-200 text-zinc-900 hover:bg-zinc-400" : "")}
      on:click={() => {dispatch('selectCenters', i)}} on:keydown={() => {dispatch('selectCenters', i)}}>
        <div class="w-full h-2" style={`background-color: ${colors[i]}`}></div>
        <div class="text-s flex flex-row justify-between">
          <span class="font-bold italic">{`Center ${i}`}</span>
          <span in:fade>{`${labels.reduce((n, val) => n + (val === i), 0)} points`}</span>
        </div>
        <span class="text-xs">{`x: ${c[0].toFixed(2)} y: ${c[1].toFixed(2)} z: ${c[2].toFixed(2)}`}</span>
      </div>
    {/each}
    </div>
  <button class="bg-blue-600 p-3" on:click={() => dispatch('restart', 1)}>Restart</button>
</div>
