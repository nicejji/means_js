<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import "@fontsource-variable/fira-code";

  onMount(() => {
    const isDark = true; // window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.remove(
      isDark ? "theme-light" : "theme-dark"
    );
    document.documentElement.classList.add(
      isDark ? "theme-dark" : "theme-light"
    );
  });
</script>

<div class="flex flex-col h-full p-5">
  <slot />
</div>
