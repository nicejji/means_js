<script lang="ts">
  import type { Camera, Object3D } from "three";
  import { useThrelte, useRender } from "@threlte/core";
  import {
    EffectComposer,
    EffectPass,
    RenderPass,
    SelectiveBloomEffect,
    KernelSize,
  } from "postprocessing";

  const { scene, renderer, camera, size } = useThrelte();
  const composer = new EffectComposer(renderer);
  let effect: SelectiveBloomEffect | null = null;
  export let selection: Set<Object3D>;

  $: effect?.selection.set(selection);

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
</script>
