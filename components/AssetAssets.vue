<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
const assets = computed(() => props.asset?.resolvedMetadata?.assets)

const assetFileType = (asset: AssetMetadata) => {
  const assetType = getAssetType(asset)

  return {
    document: () =>
      defineAsyncComponent(() => import('./AssetAssetsDocument.vue')),
    video: () => defineAsyncComponent(() => import('./AssetAssetsVideo.vue')),
    audio: () => defineAsyncComponent(() => import('./AssetAssetsAudio.vue')),
    image: () => defineAsyncComponent(() => import('./AssetAssetsImage.vue')),
    '3d': () => defineAsyncComponent(() => import('./AssetAssets3D.vue')),
    contract: () =>
      defineAsyncComponent(() => import('./AssetAssetsContract.vue')),
    other: () => defineAsyncComponent(() => import('./AssetAssetsOther.vue')),
  }[assetType]()
}
</script>

<template>
  <div v-if="isLoaded">
    <div v-if="assets?.length" class="mb-8">
      <div class="heading-inter-14-bold pb-3">
        {{ $formatMessage('token_details_assets') }}
      </div>
      <div class="flex flex-wrap gap-4">
        <component
          v-for="(fileAsset, index) in assets"
          :key="index"
          :is="assetFileType(fileAsset)"
          :asset="fileAsset"
        >
        </component>
      </div>
    </div>
  </div>
  <AppPlaceholderSection v-else slot-class="flex gap-4">
    <AppPlaceholderLine class="size-14" />
  </AppPlaceholderSection>
</template>
