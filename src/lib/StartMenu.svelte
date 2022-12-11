<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher()

  let pointsCount = ""
  let clusterCount = ""
  let plusPlusInit = true
  $: allCorrect = parseInt(clusterCount) && parseInt(pointsCount)
  const start = () => {
    if (allCorrect) {
      pointsCount = parseInt(pointsCount)
      clusterCount = parseInt(clusterCount)
      dispatch('start', {pointsCount, clusterCount, plusPlusInit})
    }
  }
</script>

<div class="flex flex-col text-white p-3 gap-2 text-s font-bold">
    <span>Points</span>
    <input class="bg-zinc-600/40" placeholder="How many points?" bind:value={pointsCount}>
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
