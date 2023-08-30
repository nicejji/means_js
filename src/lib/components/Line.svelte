<script lang="ts">
  import { T } from "@threlte/core";
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";
  import type { Object3D } from "three";
  export let from: number[];
  export let to: number[];
  export let lineRef: Object3D | null = null;
  export let color: string;
  let opacity = spring(0);

  const coords = spring([...from, ...to]);

  onMount(() => {
    $opacity = 0.25;
  });

  $: $coords = [...from, ...to];
</script>

<T.Line
  on:create={({ ref, cleanup }) => {
    lineRef = ref;
    cleanup(() => {
      lineRef = null;
    });
  }}
>
  <T.LineBasicMaterial opacity={$opacity} transparent {color} lineWidth={20} />
  <T.BufferGeometry width={5}>
    <T.BufferAttribute
      args={[new Float32Array($coords), 3]}
      attach={(parent, self) => {
        parent.setAttribute("position", self);
      }}
    />
  </T.BufferGeometry>
</T.Line>
