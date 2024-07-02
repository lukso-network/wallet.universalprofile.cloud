<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const { formatMessage } = useIntl()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
const creators = computed(() => {
  return props.asset?.tokenCreators?.length
    ? props.asset?.tokenCreators
    : props.asset?.owner
      ? [props.asset?.owner]
      : []
})
</script>

<template>
  <template v-if="isLoaded">
    <div v-if="!!creators?.length" class="animate-fade-in">
      <div class="heading-inter-14-bold pb-2">
        {{ formatMessage('asset_creators_title') }}
      </div>
      <div class="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
        <AssetCreatorRpc
          v-for="(creator, index) in creators"
          :key="index"
          :creator="creator"
          :asset="asset?.address"
        />
      </div>
    </div>
  </template>
  <AppPlaceholderSection v-else slot-class="flex gap-4">
    <AppPlaceholderLine class="h-[48px] w-[170px]" />
    <AppPlaceholderLine class="h-[48px] w-[140px]" />
  </AppPlaceholderSection>
</template>
