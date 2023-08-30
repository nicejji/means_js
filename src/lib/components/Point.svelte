<script lang="ts">
  import { T } from "@threlte/core";
  import { spring } from "svelte/motion";
  import type { Object3D } from "three";
  export let pointRef: Object3D | null = null;

  export let coord: number[];
  export let color: string;

  let scale = spring(1);

  $: if (color) {
    $scale = 3;
    setTimeout(() => {
      $scale = 1;
    }, 150);
  }
</script>

<T.Mesh
  on:create={({ ref, cleanup }) => {
    pointRef = ref;
    cleanup(() => {
      pointRef = null;
    });
  }}
  position.x={coord[0]}
  position.y={coord[1]}
  position.z={coord[2]}
  scale={$scale}
>
  <T.SphereGeometry args={[1, 64, 64]} />
  <T.MeshStandardMaterial {color} />
</T.Mesh>
