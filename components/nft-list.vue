<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { nfts, assetFilter } = storeToRefs(useProfileStore())
</script>

<template>
  <div class="pt-8">
    <h3 class="heading-inter-17-semi-bold pb-4">
      {{ $formatMessage('collectibles_title') }}
    </h3>
    <div class="grid gap-6 grid-col grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <NftCard
        v-for="(asset, index) in nfts(assetFilter)"
        :key="index"
        :asset="asset"
        :has-address="true"
      />
    </div>
  </div>
</template>
