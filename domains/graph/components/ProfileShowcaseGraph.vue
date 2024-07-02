<script setup lang="ts">
import { keccak256 } from 'web3-utils'

import type { ProfileShowcaseQuery } from '@/.nuxt/gql/default'

const { isTestnet } = storeToRefs(useAppStore())

const isLoading = ref(false)
const profilePool = ref()
const profilesOnDisplay = ref()

const getProfiles = async () => {
  try {
    isLoading.value = true
    const { profiles }: ProfileShowcaseQuery = await GqlProfileShowcase()

    if (graphLog.enabled) {
      graphLog('profileShowcase', profiles)
    }

    profilePool.value = profiles
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const shuffleProfiles = async () => {
  const profileIndexes = getDistinctRandomIntegers(
    0,
    profilePool.value.length - 1,
    isTestnet.value ? PROFILE_SHOWCASE_LIMIT * 2 : PROFILE_SHOWCASE_LIMIT
  )
  const randomProfiles = []

  for (const index of profileIndexes) {
    const profileAtIndex = profilePool.value[index]
    const metadata = validateLsp3Metadata({
      name: profileAtIndex.name,
      profileImage: profileAtIndex.profileImages,
      backgroundImage: profileAtIndex.backgroundImages,
    })
    const profile = await browserProcessMetadata(metadata, keccak256)
    randomProfiles.push({
      address: profileAtIndex.id,
      ...profile,
    })
  }

  profilesOnDisplay.value = randomProfiles
}

onMounted(async () => {
  await getProfiles()
  shuffleProfiles()
})
</script>

<template>
  <div class="relative">
    <div
      class="flex flex-col justify-center transition-opacity duration-300 md:mb-20"
      :class="{
        'opacity-0': isLoading,
        'opacity-100': !isLoading,
      }"
    >
      <div class="mb-5 flex items-center">
        <div class="heading-inter-21-semi-bold">
          {{ $formatMessage('shuffle_title') }}
        </div>
        <div
          class="ml-4 flex size-10 cursor-pointer items-center justify-center rounded-full border border-neutral-90 bg-neutral-100 transition hover:scale-105 hover:border-neutral-80 active:scale-[1.01]"
          @click="shuffleProfiles"
        >
          <lukso-icon name="reload" />
        </div>
      </div>
      <div
        class="grid grid-cols-1 items-start justify-items-center gap-12 sm:grid-cols-2"
        :class="{ 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': isTestnet }"
      >
        <ProfileShowcaseCardGraph
          v-for="profile in profilesOnDisplay"
          :key="profile.address"
          :profile="profile"
        />
      </div>
    </div>
    <lukso-icon
      name="progress-indicator-alt"
      size="x-large"
      v-if="isLoading"
      class="absolute left-[calc(50%-20px)] top-[calc(50%-20px)]"
    ></lukso-icon>
  </div>
</template>
