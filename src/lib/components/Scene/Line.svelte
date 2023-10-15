<script lang="ts">
  import { T } from "@threlte/core";
  import { spring } from "svelte/motion";
  export let from = [0, 0, 0];
  export let to = [0, 0, 0];
  export let color = "white";

  const smoothed = spring({
    coords: [...from, ...to],
  });

  $: $smoothed = {
    coords: [...from, ...to],
  };
</script>

<T.Line on:create>
  <T.LineBasicMaterial opacity={1} transparent {color} lineWidth={20} />
  <T.BufferGeometry width={5}>
    <T.BufferAttribute
      args={[new Float32Array($smoothed.coords), 3]}
      attach={(parent, self) => {
        parent.setAttribute("position", self);
      }}
    />
  </T.BufferGeometry>
</T.Line>
