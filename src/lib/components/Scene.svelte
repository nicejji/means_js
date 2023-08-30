<script lang="ts">
  import type { MeansState, Point } from "$lib/kmeans";
  import { T } from "@threlte/core";
  import { OrbitControls, interactivity } from "@threlte/extras";
  import type { Object3D } from "three";
  import Center from "./Center.svelte";
  import Line from "./Line.svelte";
  import PointObject from "./Point.svelte";
  import Bloom from "./Bloom.svelte";

  interactivity();

  export let state: MeansState;
  export let points: Point[];
  export let colors: string[];

  const pointRefs = Array<null | Object3D>(points.length).fill(null);
  const lineRefs = Array<null | Object3D>(points.length).fill(null);
  let selection = new Set<Object3D>();

  $: ({
    data: { centers, labels },
  } = state);
</script>

<Bloom {selection} />
<T.PerspectiveCamera makeDefault position={[250, 250, 250]}>
  <OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.AxesHelper args={[500]} />
<T.DirectionalLight color="white" intensity={1} position={[0, 10, 10]} />
<T.AmbientLight color="white" intensity={1} />

{#each points as coord, i}
  {@const color = colors[labels[i]] ?? "white"}
  <PointObject bind:pointRef={pointRefs[i]} {color} {coord} />
  {#if labels.length}
    <Line
      bind:lineRef={lineRefs[i]}
      from={centers[labels[i]]}
      to={coord}
      {color}
    />
  {/if}
{/each}
{#each centers as coords, i}
  <Center
    onPointerEnter={(e) => {
      selection.add(e.object);
      labels.forEach((l, pIndex) => {
        if (l === i) {
          const ref = pointRefs[pIndex];
          const lineRef = lineRefs[pIndex];
          if (ref) selection.add(ref);
          if (lineRef) selection.add(lineRef);
        }
      });
      selection = selection;
    }}
    onPointerLeave={(e) => {
      selection.delete(e.object);
      selection = selection;
      labels.forEach((l, pIndex) => {
        if (l === i) {
          const ref = pointRefs[pIndex];
          const lineRef = lineRefs[pIndex];
          if (ref) selection.delete(ref);
          if (lineRef) selection.delete(lineRef);
        }
      });
      selection = selection;
    }}
    color={colors[i]}
    {coords}
  />
{/each}
