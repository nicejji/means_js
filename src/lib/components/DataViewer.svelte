<script lang="ts">
  import type { MeansState } from "$lib/kmeans";

  export let state: MeansState;
  export let colors: string[];

  $: ({
    meta: { step, iteration },
    data: { centers, labels },
  } = state);

  $: status = step === "init" ? "Initialization" : `Updated ${step}`;
</script>

<table class="table-auto">
  <thead class="bg-highlight-low p-4">
    <th />
    <th>Coordinates</th>
    <th>Points</th>
  </thead>
  <tbody>
    {#each centers.map((c) => c.map(Math.floor)) as [x, y, z], i}
      {@const count = labels.filter((l) => l === i).length}
      <tr>
        <td style:background={colors[i]}>{i + 1}</td>
        <td>{[x, y, z]}</td>
        <td>{count}</td>
      </tr>
    {/each}
  </tbody>
</table>
<!-- <div class="flex flex-col gap-2 flex-1 h-full"> -->
<!--   <span class="font-bold">Iteration: {iteration} ({status})</span> -->
<!--   <div class="flex flex-col overflow-auto gap-3 h-full"> -->
<!--     {#each centers.map((c) => c.map(Math.floor)) as [x, y, z], i} -->
<!--       {@const count = labels.filter((l) => l === i).length} -->
<!--       <div -->
<!--         style:border-color={colors[i]} -->
<!--         class="flex flex-col p-3 rounded-lg border-2" -->
<!--       > -->
<!--         <span>Center: {i + 1} ({count} points)</span> -->
<!--         <span class="text-sm text-subtle">x: {x} y: {y} z: {z}</span> -->
<!--       </div> -->
<!--     {/each} -->
<!--   </div> -->
<!-- </div> -->
