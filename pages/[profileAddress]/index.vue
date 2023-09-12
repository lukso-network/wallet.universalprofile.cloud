<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { AssetFilter } from '@/types/assets'

const { status } = useProfileStore()

const { assetFilter, tokens, nfts } = storeToRefs(useProfileStore())

const tokensCount = computed(() => {
  const count =
    tokens.value(AssetFilter.owned)?.length +
    nfts.value(AssetFilter.owned)?.length +
    1 // we +1 for LYX token that we show even with 0 balance

  return count
})

const nftsCount = computed(() => {
  const count =
    tokens.value(AssetFilter.created)?.length +
    nfts.value(AssetFilter.created)?.length

  return count
})
</script>

<template>
  <div class="relative">
    <div
      class="max-w-[835px] py-20 px-4 mx-auto relative transition-opacity duration-300"
      :class="{
        'opacity-0': status.isAssetLoading || status.isProfileLoading,
        'opacity-100': !status.isAssetLoading && !status.isProfileLoading,
      }"
    >
      <Profile />
      <div>
        <div>
          <div class="pt-10 gap-4 flex">
            <lukso-button
              size="small"
              variant="secondary"
              :is-active="assetFilter === AssetFilter.owned ? true : undefined"
              :count="tokensCount"
              @click="assetFilter = AssetFilter.owned"
              >{{ $formatMessage('asset_filter_owned_assets') }}</lukso-button
            >
            <lukso-button
              size="small"
              variant="secondary"
              :is-active="
                assetFilter === AssetFilter.created ? true : undefined
              "
              :count="nftsCount"
              @click="assetFilter = AssetFilter.created"
              >{{ $formatMessage('asset_filter_created_assets') }}</lukso-button
            >
          </div>
          <TokensList />
          <NftList />
        </div>
      </div>
    </div>
    <lukso-icon
      name="progress-indicator-alt"
      size="x-large"
      v-if="status.isAssetLoading || status.isProfileLoading"
      class="absolute top-1/2 left-1/2 transform"
    ></lukso-icon>
  </div>
</template>
