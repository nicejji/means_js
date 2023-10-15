<script lang="ts">
  import { T } from "@threlte/core";
  import { spring } from "svelte/motion";

  export let coord = [0, 0, 0];
  export let color = "white";
  export let scale = 1;

  const smoothed = spring({
    coord,
    scale,
  });

  $: $smoothed = {
    coord,
    scale,
  };
</script>

<T.Mesh
  on:create
  on:click
  on:pointerenter
  on:pointleave
  position.x={$smoothed.coord[0]}
  position.y={$smoothed.coord[1]}
  position.z={$smoothed.coord[2]}
  scale={$smoothed.scale}
>
  <T.SphereGeometry args={[1, 64, 64]} />
  <T.MeshStandardMaterial {color} />
</T.Mesh>
