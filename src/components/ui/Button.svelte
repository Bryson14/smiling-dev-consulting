<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { cn } from "@/lib/utils";
  import {
    buttonVariants,
    type ButtonSize,
    type ButtonVariant,
  } from "./button";

  let {
    variant = "default",
    size = "default",
    class: className = "",
    children,
    ...rest
  }: HTMLButtonAttributes & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    class?: string;
    children?: Snippet;
  } = $props();
</script>

<button
  data-slot="button"
  class={cn(buttonVariants({ variant, size }), className)}
  {...rest}
>
  {@render children?.()}
</button>
