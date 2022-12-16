<script>
  import { createEventDispatcher } from "svelte";
  import { generate_points } from "./kmeans";

  const dispatch = createEventDispatcher()

  function isValidPoints(str) {
    try { JSON.parse(str) } catch (e) { return false }
    return true
  }

  let points = ""
  let textarea;
  let clusterCount = ""
  let plusPlusInit = true
  let randomQuantity = ""
  $: allCorrect = parseInt(clusterCount) && isValidPoints(points)
  const start = () => {
    if (allCorrect) {
      points = JSON.parse(points)
      clusterCount = parseInt(clusterCount)
      dispatch('start', {points, clusterCount, plusPlusInit})
    }
  }
</script>

<div class="flex flex-col text-white p-3 gap-2 text-s font-bold">
  <div class="flex flex-row items-center gap-5">
    <span>Points</span>
    <button class="bg-zinc-500 text-xs p-1" on:click={() => {textarea.select(); document.execCommand('copy')}}>copy</button>
  </div>
    <textarea class="bg-zinc-600/40 outline-none p-3" placeholder="Enter points" cols="20" rows="10" bind:value={points} bind:this={textarea}></textarea>
    <div class="flex flex-row w-fit gap-2 items-center">
      <button class="text-xs" on:click={() => {points = JSON.stringify(generate_points(randomQuantity))}}>Generate randomly</button>
      <input class="bg-transparent text-xs w-min" type="number" placeholder="quantity" bind:value={randomQuantity}>
    </div>
    <p class="font-bold">Clusters</p>
    <input class="bg-zinc-600/40" placeholder="How many clusters?" bind:value={clusterCount}>
    <p class="text-s font-bold">Initalization type<p>
    <div class="flex flex-row justify-between w-full">
      <button 
        class={(plusPlusInit ? "bg-blue-200/90 text-zinc-700 " : "bg-zinc-600/40 hover:bg-zinc-300/90 hover:text-zinc-700 ") + "p-2 font-bold " }
        on:click={() => {plusPlusInit=true}}>KMeans++</button>
      <button 
        class={(!plusPlusInit ? "bg-red-200/90 text-zinc-700 " : "bg-zinc-600/40 hover:bg-zinc-300/90 hover:text-zinc-700 ") + "p-2 font-bold"}
        on:click={() => {plusPlusInit=false}}>First Points</button>
    </div>
    <div class="h-full"></div>
    {#if allCorrect}
      <hr>
      <button class="bg-emerald-700/90 p-3 w-full hover:bg-emerald-600/90" on:click={() => {start()}}>
      Start
    </button>
    {/if}
</div>
