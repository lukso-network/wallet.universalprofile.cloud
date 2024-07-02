<script setup lang="ts">
import type { AssetShowcaseQuery } from '@/.nuxt/gql/default'

const isLoading = ref(false)
const assetsPool = ref<AssetShowcaseQuery['assets']>()
const assetsOnDisplay = ref<Asset[]>([])

const getAssets = async () => {
  isLoading.value = true
  const { assets }: AssetShowcaseQuery = await GqlAssetShowcase()

  if (graphLog.enabled) {
    graphLog('assetShowcase', assets)
  }
  assetsPool.value = assets
  isLoading.value = false
}

const shuffleAssets = async () => {
  if (!assetsPool.value) {
    return
  }

  const assetIndexes = getDistinctRandomIntegers(
    0,
    assetsPool.value?.length - 1,
    ASSET_SHOWCASE_LIMIT
  )
  const randomAssets = []

  for (const index of assetIndexes) {
    const assetAtIndex = assetsPool.value[index]
    randomAssets.push(createAssetObject(assetAtIndex))
  }

  assetsOnDisplay.value = randomAssets
}

onMounted(async () => {
  await getAssets()
  await shuffleAssets()
})
</script>

<template>
  <div
    class="flex w-full flex-col justify-center transition-opacity duration-300 md:mb-20"
  >
    <div class="mb-5 flex w-full items-center">
      <div class="heading-inter-21-semi-bold">
        {{ $formatMessage('shuffle_assets_title') }}
      </div>
      <div
        class="ml-4 flex size-10 cursor-pointer items-center justify-center rounded-full border border-neutral-90 bg-neutral-100 transition hover:scale-105 hover:border-neutral-80 active:scale-[1.01]"
        @click="shuffleAssets"
      >
        <lukso-icon name="reload" />
      </div>
    </div>
    <div
      class="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-12"
    >
      <AssetShowcaseItemGraph
        v-for="asset in assetsOnDisplay"
        :key="asset.address"
        :asset="asset"
      />
    </div>
  </div>
</template>
