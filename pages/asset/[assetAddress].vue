<script setup lang="ts">
const address = useRouter().currentRoute.value.params?.assetAddress
const tokenId = useRouter().currentRoute.value.params?.tokenId
const asset = useAsset()(address, tokenId)
</script>

<template>
  <div class="relative">
    <AppPageLoader :is-loading="!asset">
      <TokenAssetView v-if="isToken(asset)" :asset="asset" />
      <NftAssetView v-else :asset="asset" />
    </AppPageLoader>
  </div>
</template>
