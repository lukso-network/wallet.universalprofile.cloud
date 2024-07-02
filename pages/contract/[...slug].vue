<script setup lang="ts">
import { watch } from 'vue'

const assetAddress = computed(() => {
  const [assetAddress] = useRouter().currentRoute.value.params?.slug || []
  return assetAddress
})
const tokenId = computed(() => {
  const [, tokenId] = useRouter().currentRoute.value.params?.slug || []
  return tokenId
})
const asset = useAsset()(assetAddress, tokenId)

watch(
  () => asset.value,
  asset => {
    if (!asset || asset.isLoading) {
      return
    }
    // anything that is not LSP7/8 we open in explorer
    if (!isAsset(asset)) {
      return window.open(explorerContractUrl(asset.address), '_blank')
    }

    navigateTo(assetRoute(asset.address, asset.tokenId))
  }
)
</script>

<template>
  <div class="relative">
    <AppPageLoader :is-loading="true" />
  </div>
</template>
