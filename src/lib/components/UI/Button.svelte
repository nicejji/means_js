<script lang="ts">
  import { twMerge } from "tailwind-merge";
  export let size: keyof typeof sizes = "md";
  export let disabled = false;

  const sizes = {
    xs: "px-4 py-3 text-xs",
    sm: "px-5 py-3 text-sm",
    md: "px-5 py-3",
    lg: "px-6 py-4 text-lg",
    xl: "px-7 py-5 text-xl",
  };
</script>

<button
  {disabled}
  class={twMerge(
    "h-fit disabled:cursor-not-allowed disabled:contrast-50 enabled:hover:bg-gradient-to-t from-black/20 to-black/20  font-bold transition-all rounded-lg enabled:active:scale-90 w-fit",
    sizes[size],
    $$props.class
  )}
  on:click
>
  <slot />
</button>
