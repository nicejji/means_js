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
  <div class="flex flex-row items-center justify-between">
    <span>Points</span>
    <button class="bg-yellow-500/30 text-xs p-1 px-3 hover:bg-zinc-600" on:click={() => {textarea.select(); document.execCommand('copy')}}>copy</button>
  </div>
    <textarea class="bg-zinc-600/40 outline-none p-3 text-xs font-normal" placeholder="Enter points" cols="20" rows="5" bind:value={points} bind:this={textarea}></textarea>
    <div class="flex flex-row w-fit gap-2 items-center">
      <button class="text-xs hover:bg-zinc-700 p-3 " on:click={() => {points = JSON.stringify(generate_points(randomQuantity))}}>Generate randomly 🎲</button>
      <input class="bg-transparent text-xs w-20" placeholder="quantity" bind:value={randomQuantity}>
    </div>
    <p class="font-bold">Clusters</p>
    <input class="bg-zinc-600/40" placeholder="Centers quantity" bind:value={clusterCount}>
    <p class="text-s font-bold">Initalization type<p>
    <div class="flex flex-row w-full gap-4 text-xs">
      <button 
        class={(plusPlusInit ? "w-full bg-blue-200/90 text-zinc-700 " : "w-full bg-zinc-600/40 hover:bg-zinc-300/90 hover:text-zinc-700 ") + "p-2 font-bold " }
        on:click={() => {plusPlusInit=true}}>KMeans++</button>
      <button 
        class={(!plusPlusInit ? "w-full bg-red-200/90 text-zinc-700 " : "w-full bg-zinc-600/40 hover:bg-zinc-300/90 hover:text-zinc-700 ") + "p-2 font-bold"}
        on:click={() => {plusPlusInit=false}}>First Points</button>
    </div>
    {#if allCorrect}
      <hr>
      <button class="bg-emerald-700/90 p-3 w-full hover:bg-emerald-600/90" on:click={() => {start()}}>
      Start
    </button>
    {/if}
</div>
