<script lang="ts">
  import { kmeans, plusPlusInit, seed3DPoints } from "$lib/utils/kmeans";
  import { Canvas } from "@threlte/core";
  import Scene from "$lib/components/Scene/Scene.svelte";
  import DataViewer from "$lib/components/DataViewer.svelte";
  import chroma from "chroma-js";
  import Range from "$lib/components/UI/Range.svelte";
  import themeStore from "$lib/stores/theme";

  let stateIndex = 0;
  let points = seed3DPoints(100, 150);

  $: states = kmeans(points, 5, plusPlusInit);
  $: currentState = states[stateIndex];

  $: palette = $themeStore.systemDark
    ? ["#eb6f92", "#f6c177", "#ebbcba", "#31748f", "#9ccfd8", "#c4a7e7"]
    : ["#b4637a", "#ea9d34", "#d7827e", "#286983", "#56949f", "#907aa9"];
  $: colors = chroma.scale(palette).colors(currentState.data.centers.length);
</script>

<div class="flex h-full w-full gap-5">
  <div
    class="flex flex-col gap-5 h-full border-highlight-med border-2 rounded-lg w-1/3 p-3"
  >
    <div class="flex flex-col h-full">
      <span class="font-bold text-xl">KMeans 3D</span>
      <span>Points: {points.length}</span>
      <Range min={0} max={states.length - 1} bind:value={stateIndex} />
    </div>
    <DataViewer state={currentState} {colors} />
  </div>
  <div
    class="h-full w-full rounded-lg border-highlight-med border-2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-highlight-med to-base"
  >
    <Canvas>
      <Scene state={currentState} {points} {colors} />
    </Canvas>
  </div>
</div>
