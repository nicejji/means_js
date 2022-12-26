<script>
  import { selectedState } from "../stores";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let labels
  export let centers
  export let colors
  export let statesCount
  export let selected
  export let hidden

  const resolveStatus = (cur, end) => {
    if (cur === 0) return "Initialized centers"
    if (cur === 1) return "Calculated labels"
    if (cur > end - 2) return "Centers not changed, ending..."
    return cur % 2 ? "Updated labels" : "Moved centroids"
  }
  $: status = resolveStatus($selectedState, statesCount)

  const toggleAll = (event) => {[...Array(centers.length).keys()].map(v => dispatch(event, v))}
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
  <span class="text-xs text-zinc-400">Click on center to watch on connections</span>
  <div class="overflow-scroll flex flex-col h-full gap-2">
    <div class="flex gap-2">
      <button class="w-full text-xs bg-zinc-600/40 hover:bg-zinc-300/90 hover:text-zinc-700 p-2 font-bold"
              on:click={() => {toggleAll('hideCenters')}}>Toggle visibility</button> 
      <button class="w-full text-xs bg-zinc-600/40 hover:bg-zinc-300/90 hover:text-zinc-700 p-2 font-bold"
              on:click={() => {toggleAll('selectCenters')}}>Toggle selection</button> 
    </div>
    {#each centers as c, i}
      <div class="flex flex-row w-full justify-between gap-2">
        <button class={"text-xs " + (!hidden[i] ? "text-white" : "text-zinc-500")} on:click={() => dispatch('hideCenters', i)}>{hidden[i] ? "Show" : "Hide"}</button>
        <div
        class={"w-full flex flex-col px-2 hover:bg-zinc-700 cursor-default " + (selected[i] && !hidden[i] ? "bg-zinc-200 text-zinc-900 hover:bg-zinc-400" : "")}
        on:click={() => {dispatch('selectCenters', i)}} on:keydown={() => {dispatch('selectCenters', i)}}>
          <div class="w-full h-2" style={`background-color: ${colors[i]}`}></div>
          <div class="text-s flex flex-row justify-between">
            <span class="font-bold italic">{`Center ${i}`}</span>
            <span>{`${labels.reduce((n, val) => n + (val === i), 0)} points`}</span>
          </div>
          <span class="text-xs">{`x: ${c[0].toFixed(2)} y: ${c[1].toFixed(2)} z: ${c[2].toFixed(2)}`}</span>
        </div>
      </div>
    {/each}
    </div>
  <button class="bg-cyan-900 p-3 hover:bg-cyan-800" on:click={() => dispatch('restart', 1)}>Restart</button>
</div>
