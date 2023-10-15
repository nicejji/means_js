<script lang="ts">
  import type { MeansState } from "$lib/utils/kmeans";
  import { T } from "@threlte/core";
  import { OrbitControls, interactivity } from "@threlte/extras";
  import type { Object3D } from "three";
  import Line from "./Line.svelte";
  import Point from "./Point.svelte";
  import Bloom from "./Bloom.svelte";
  import themeStore from "$lib/stores/theme";

  interactivity();

  export let state: MeansState;
  export let points: number[][];
  export let colors: string[];

  let selection = new Set<Object3D>();

  $: ({
    data: { centers, labels },
  } = state);
</script>

<Bloom {selection} />

<T.PerspectiveCamera makeDefault position={[250, 250, 250]}>
  <OrbitControls enableDamping />
</T.PerspectiveCamera>
<T.DirectionalLight color="white" intensity={1} position={[0, 10, 10]} />
<T.AmbientLight color="white" intensity={1} />

{#each points as coord, i}
  {@const color =
    colors[labels[i]] ?? ($themeStore.systemDark ? "white" : "black")}
  <Point {color} {coord} />
  <Line from={labels.length ? centers[labels[i]] : coord} to={coord} {color} />
{/each}
{#each centers as coord, i}
  {@const color = colors[i]}
  <Point on:click={() => console.log("clicked")} {color} {coord} scale={5} />
{/each}
