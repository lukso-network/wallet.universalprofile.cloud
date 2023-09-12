<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { AssetFilter } from '@/types/assets'

const { tokens, assetFilter } = storeToRefs(useProfileStore())
</script>

<template>
  <div class="pt-8">
    <h3 class="heading-inter-17-semi-bold pb-4">
      {{ $formatMessage('tokens_title') }}
    </h3>
    <div class="grid gap-6 grid-col grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <LyxCard v-if="assetFilter === AssetFilter.owned" />
      <TokenCard
        v-for="(asset, index) in tokens(assetFilter)"
        :key="index"
        :asset="asset"
        :has-address="true"
        :is-openable="true"
      />
    </div>
  </div>
</template>
