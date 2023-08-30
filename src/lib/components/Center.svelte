<script lang="ts">
  import { T } from "@threlte/core";
  import { spring } from "svelte/motion";

  const scale = spring(1);
  export let coords: number[];
  export let color: string;
  const smoothCoords = spring(coords);

  $: $smoothCoords = coords;

  export let onPointerEnter: (e: any) => void;
  export let onPointerLeave: (e: any) => void;
</script>

<T.Mesh
  scale={$scale}
  on:pointerenter={(e) => {
    $scale = 2;
    onPointerEnter(e);
  }}
  on:pointerleave={(e) => {
    $scale = 1;
    onPointerLeave(e);
  }}
  position.x={$smoothCoords[0]}
  position.y={$smoothCoords[1]}
  position.z={$smoothCoords[2]}
>
  <T.SphereGeometry args={[4, 64, 64]} />
  <T.MeshStandardMaterial {color} />
</T.Mesh>
