<script lang="ts">
  import "../app.css";
  import "@fontsource-variable/fira-code";
  import themeStore from "$lib/stores/theme";
  import { browser } from "$app/environment";

  $: {
    if (browser) {
      document.documentElement.classList.remove(
        $themeStore.systemDark ? "theme-light" : "theme-dark"
      );
      document.documentElement.classList.add(
        $themeStore.systemDark ? "theme-dark" : "theme-light"
      );
    }
  }

  const x = 5;
</script>

<div class="flex flex-col h-full p-5">
  <slot />
</div>
