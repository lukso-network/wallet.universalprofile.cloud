<script setup lang="ts">
const { isSearchOpen } = storeToRefs(useAppStore())

const handleClose = () => {
  isSearchOpen.value = false
}
</script>

<template>
  <div
    @click="handleClose"
    class="fixed left-0 top-0 z-[1000] h-[100vh] w-[100vw] animate-fade-in bg-[rgba(36,53,66,0.8)] backdrop-blur-sm animation-duration-200"
  ></div>
  <div
    id="mobile-search"
    class="fixed top-0 z-[1001] w-full animate-fade-in p-4 animation-duration-200"
  >
    <AppNavbarProfileSearch />
    <div
      @click="handleClose"
      class="group absolute right-7 top-7 cursor-pointer bg-neutral-100"
    >
      <lukso-icon
        name="close-lg"
        class="transition group-hover:opacity-60"
      ></lukso-icon>
    </div>
  </div>
</template>
