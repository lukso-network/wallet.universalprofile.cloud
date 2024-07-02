<script setup lang="ts">
type Props = {
  slotClass?: string
}

defineProps<Props>()
</script>

<template>
  <div>
    <div
      class="mb-3 h-[17px] w-1/2 animate-pulse rounded-4 bg-neutral-90"
    ></div>
    <div :class="slotClass">
      <slot />
    </div>
  </div>
</template>
