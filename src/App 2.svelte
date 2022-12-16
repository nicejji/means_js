<script>
  import './app.css';
  import { fade } from 'svelte/transition'

  import Panel from './lib/Panel.svelte'
  import KMeans from './lib/kmeans.js'

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
  let selected = [];
  let isStarted = false

  const start = ({pointsCount, clusterCount, plusPlusInit, customPoints}) => {
    if (!customPoints) {
      const generated = []
      for (let i=0; i < pointsCount; i++) {
        generated.push([Math.random() * 150, Math.random() * 150, Math.random() * 150])
      }
      points = generated
    }
    else {
      points = customPoints
    }
    states = [...KMeans(points, clusterCount, plusPlusInit)]
    colors = chroma.scale('Spectral').mode('lab').colors(clusterCount)
    selectedState.set(0)
    selected = new Array(centers.length).fill(false)
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
      <Threlte.Mesh 
        geometry={new Three.SphereGeometry(1, 64, 64)}
        material={new Three.MeshStandardMaterial({ color: colors[labels[i]] || "white"})}
        position={{x: p[0], y: p[1], z: p[2]}}
      />
      {#if labels.length && selected[labels[i]]}
        <Threlte.Line points={[centers[labels[i]], p]} material={new Three.LineBasicMaterial({color: colors[labels[i]]})}/>
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
  <div transition:fade class="w-full h-full text-zinc-300 text-3xl font-bold flex justify-center items-center">
    <span>Waiting for init...</span>
  </div>
{/if}

<Panel 
  on:start={e => start(e.detail)}
  on:restart={() => isStarted = !isStarted}
  on:selectCenters={(e) => {selected[e.detail] = !selected[e.detail]}}
  {labels} {centers} {colors} {statesCount} {isStarted} {selected}
/>
