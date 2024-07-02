<script setup lang="ts">
const { currentNetwork, isTestnet } = storeToRefs(useAppStore())
const { search } = useAlgoliaSearch<IndexedProfile>(
  currentNetwork.value.indexName
)
const isLoading = ref(false)
const profilePool = ref<IndexedProfile[]>([])
const profilesOnDisplay = ref<IndexedProfile[]>([])
const { cacheValue } = useCache()

const queryProfiles = async () => {
  const profiles = await search({
    query: '',
    requestOptions: {
      hitsPerPage: PROFILE_SHOWCASE_POOL_SIZE,
    },
  })

  return profiles.hits
}

const getProfiles = async () => {
  isLoading.value = true
  profilePool.value =
    (await cacheValue<IndexedProfile[]>(queryProfiles, {
      key: 'profiles',
      expiryAfter: PROFILES_CACHE_EXPIRY,
    })) || []
  isLoading.value = false
}

const shuffleProfiles = () => {
  const richProfiles = profilePool.value.filter(
    profile => profile.hasProfileImage && profile.hasBackgroundImage
  )

  const profileIndexes = getDistinctRandomIntegers(
    0,
    richProfiles.length - 1,
    isTestnet.value ? PROFILE_SHOWCASE_LIMIT * 2 : PROFILE_SHOWCASE_LIMIT
  )

  const randomProfiles: IndexedProfile[] = []
  for (const index of profileIndexes) {
    randomProfiles.push(richProfiles[index])
  }

  profilesOnDisplay.value = randomProfiles
}

onMounted(async () => {
  await getProfiles()
  shuffleProfiles()
})
</script>

<template>
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
        class="ml-4 flex size-10 cursor-pointer items-center justify-center rounded-full border border-neutral-90 bg-neutral-100 transition hover:scale-105 hover:border-neutral-80"
        @click="shuffleProfiles"
      >
        <lukso-icon name="reload" />
      </div>
    </div>
    <div
      class="grid grid-cols-1 items-start justify-items-center gap-12 sm:grid-cols-2"
      :class="{ 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': isTestnet }"
    >
      <ProfileShowcaseCardRpc
        v-for="profile in profilesOnDisplay"
        :key="profile.address"
        :address="profile.address"
      />
    </div>
  </div>
  <lukso-icon
    name="progress-indicator-alt"
    size="x-large"
    v-if="isLoading"
    class="absolute left-1/2 top-20"
  ></lukso-icon>
</template>
