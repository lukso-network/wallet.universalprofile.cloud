<script setup lang="ts">
type Props = {
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const { isLoading } = toRefs(props)
const { isLoadedApp } = storeToRefs(useAppStore())

const isLoaded = computed(() => isLoadedApp.value && !isLoading.value)
</script>

<template>
  <div class="relative">
    <div
      class="relative px-4 py-6 sm:py-20"
      :class="{
        'opacity-0': !isLoaded,
        'animate-fade-in opacity-100 transition-opacity delay-200  duration-300':
          isLoaded,
      }"
    >
      <slot />
    </div>
    <AppLoader
      v-if="!isLoaded"
      class="absolute left-[calc(50vw-20px)] top-[calc(50vh-20px)] sm:top-[300px]"
    />
  </div>
</template>
