<script lang="ts">
  import type { MeansState, Point } from "$lib/kmeans";
  import { T, useThrelte, useRender } from "@threlte/core";
  import {
    EffectComposer,
    EffectPass,
    RenderPass,
    SelectiveBloomEffect,
    KernelSize,
  } from "postprocessing";
  import { OrbitControls, interactivity } from "@threlte/extras";
  import type { Camera, Object3D } from "three";
  import Center from "./Center.svelte";
  import Line from "./Line.svelte";

  interactivity();
  const { scene, renderer, camera, size } = useThrelte();

  const composer = new EffectComposer(renderer);
  let effect: SelectiveBloomEffect;

  const setupEffectComposer = (camera: Camera) => {
    composer.removeAllPasses();
    composer.addPass(new RenderPass(scene, camera));
    effect = new SelectiveBloomEffect(scene, camera, {
      intensity: 1,
      luminanceThreshold: 0,
      height: 512,
      width: 512,
      luminanceSmoothing: 0.08,
      mipmapBlur: true,
      kernelSize: KernelSize.MEDIUM,
    });

    composer.addPass(new EffectPass(camera, effect));
  };
  // We need to set up the passes according to the camera in use
  $: setupEffectComposer($camera);

  $: composer.setSize($size.width, $size.height);

  useRender((_, delta) => {
    composer.render(delta);
  });

  export let state: MeansState;
  export let points: Point[];
  export let colors: string[];

  const pointRefs = Array<null | Object3D>(points.length).fill(null);
  const lineRefs = Array<null | Object3D>(points.length).fill(null);

  $: ({
    data: { centers, labels },
  } = state);
</script>

<T.PerspectiveCamera makeDefault position={[250, 250, 250]}>
  <OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.AxesHelper args={[500]} />
<T.DirectionalLight color="white" intensity={1} position={[0, 10, 10]} />
<T.AmbientLight color="white" intensity={1} />

{#each points as [x, y, z], i}
  {@const color = colors[labels[i]] ?? "white"}
  <T.Mesh
    on:create={({ ref, cleanup }) => {
      pointRefs[i] = ref;
      cleanup(() => {
        pointRefs[i] = null;
      });
    }}
    position.x={x}
    position.y={y}
    position.z={z}
  >
    <T.SphereGeometry args={[1, 64, 64]} />
    <T.MeshStandardMaterial {color} />
  </T.Mesh>
  {#if labels.length}
    <Line
      bind:lineRef={lineRefs[i]}
      from={centers[labels[i]]}
      to={[x, y, z]}
      {color}
    />
  {/if}
{/each}
{#each centers as coords, i}
  <Center
    onPointerEnter={(e) => {
      effect?.selection?.add(e.object);
      labels.forEach((l, pIndex) => {
        if (l === i) {
          const ref = pointRefs[pIndex];
          const lineRef = lineRefs[pIndex];
          if (ref) effect?.selection?.add(ref);
          if (lineRef) effect?.selection?.add(lineRef);
        }
      });
    }}
    onPointerLeave={(e) => {
      effect?.selection.delete(e.object);
      labels.forEach((l, pIndex) => {
        if (l === i) {
          const ref = pointRefs[pIndex];
          const lineRef = lineRefs[pIndex];
          if (ref) effect?.selection?.delete(ref);
          if (lineRef) effect?.selection?.delete(lineRef);
        }
      });
    }}
    color={colors[i]}
    {coords}
  />
{/each}
