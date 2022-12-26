<script>
  import './app.css';

  import StartMenu from './lib/StartMenu.svelte';
  import IterMenu from './lib/IterMenu.svelte';
  import { KMeans } from './lib/kmeans.js'

  import { selectedState } from './stores';

  import chroma from 'chroma-js'
  import * as Threlte from '@threlte/core'
  import * as Three from 'three'

  let states = [[[], []]]
  $: centers = states[$selectedState][0];
  $: labels = states[$selectedState][1];
  $: statesCount = states.length

  let points = []
  let colors = []
  let selected = []
  let hidden = []
  let isStarted = false
  let isBack = false

  const start = (data) => {
    points = data.points
    states = [...KMeans(points, data.clusterCount, data.plusPlusInit)]
    colors = chroma.scale('Spectral').mode('lab').colors(data.clusterCount)
    selectedState.set(0)
    selected = new Array(centers.length).fill(false)
    hidden = new Array(centers.length).fill(false)
    isStarted = true
  }
</script>

{#if isStarted}
  <Threlte.Canvas>
    <Threlte.PerspectiveCamera position={{ x: 250, y: 250, z: 250}}>
      <Threlte.OrbitControls/>
    </Threlte.PerspectiveCamera>

    <Threlte.AmbientLight color="white" intensity={0.2}/>
    <Threlte.DirectionalLight color="white" intensity={1}/>
    <Threlte.Three type={new Three.AxesHelper(500)}/>

    {#each points as p, i}
      {#if !hidden[labels[i]]}
        <Threlte.Mesh 
          geometry={new Three.SphereGeometry(1, 64, 64)}
          material={new Three.MeshStandardMaterial({ color: colors[labels[i]] || "white"})}
          position={{x: p[0], y: p[1], z: p[2]}}
        />
        {#if labels.length && selected[labels[i]]}
          <Threlte.Line points={[centers[labels[i]], p]} material={new Three.LineBasicMaterial({color: colors[labels[i]]})}/>
        {/if}
      {/if}
    {/each}

    {#each centers as c, i}
      <Threlte.Mesh 
        geometry={new Three.SphereGeometry(4, 64, 64)}
        material={new Three.MeshStandardMaterial({ color: colors[i]})}
        position={{x: c[0], y: c[1], z: c[2]}}
      />
    {/each}
  </Threlte.Canvas>
{:else}
  <div class="w-full h-full text-zinc-300 text-3xl font-bold flex justify-center items-center">
    <span>Waiting for init...</span>
  </div>
{/if}

<div class="flex flex-col bg-zinc-600/20 w-fit z-10 gap-2 items-center p-2 absolute inset-0 text-white h-full overflow-hidden">
  <div class="flex flex-row w-full px-3 gap-3">
    <span class="text-l font-extrabold">KMeans 3D</span>
    {#if isStarted}
      <button class="text-xs" on:click={() => isBack = !isBack}>{isBack ? 'Back to iterator' : 'Back to menu'}</button>
    {/if}
  </div>
  {#if !isStarted || isBack}
    <StartMenu on:start={e => {start(e.detail); isBack = false}}/>
  {:else}
    <IterMenu {labels} {centers} {colors} {statesCount} {selected} {hidden} 
      on:selectCenters={(e) => {selected[e.detail] = !selected[e.detail]}}
      on:hideCenters={e => hidden[e.detail] = !hidden[e.detail]}/>
  {/if}
</div>
