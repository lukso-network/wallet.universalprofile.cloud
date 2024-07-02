<script setup lang="ts">
definePageMeta({
  layout: 'landing',
})

const { isTestnet } = storeToRefs(useAppStore())
</script>

<template>
  <AppPageLoader>
    <div
      class="mx-auto flex max-w-[1200px] flex-col items-center px-6 transition-opacity duration-300 lg:px-4"
    >
      <AppTestnetWarning v-if="isTestnet" class="-mb-6" />
      <h1 class="flex flex-col justify-center pt-16 text-center">
        <div class="heading-apax-48-regular">
          {{ $formatMessage('hero_title_01') }}
        </div>
        <div class="heading-apax-48-bold">
          {{ $formatMessage('hero_title_02') }}
        </div>
      </h1>
      <div
        class="mb-20 mt-8 flex w-full flex-col items-center justify-center sm:mb-28 sm:w-1/2 lg:w-2/5"
      >
        <AppNavbarProfileSearch />
        <div
          class="paragraph-inter-14-regular mt-6 text-center text-neutral-40"
        >
          <ProfileInfo />
        </div>
      </div>
      <CreateProfileBox />
      <div
        class="relative grid w-full grid-cols-1 gap-12 pb-20 md:pb-0"
        :class="{ 'lg:grid-cols-1': isTestnet, 'lg:grid-cols-2': !isTestnet }"
      >
        <ProfileShowcase />
        <ActivityList v-if="!isTestnet" />
      </div>
      <DappShowcase />
      <AssetShowcase />
    </div>
  </AppPageLoader>
</template>
