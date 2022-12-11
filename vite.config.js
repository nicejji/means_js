import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'
import seqPreprocessor from 'svelte-sequential-preprocessor'
import { preprocessThrelte } from '@threlte/preprocess'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  preprocess: seqPreprocessor([
    preprocess({postcss: true}),
    preprocessThrelte()
  ])
//  preprocess: [
//    preprocess ({
//      postcss: true
//    })
//  ]
})
