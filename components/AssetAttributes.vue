<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
const attributes = computed(() => props.asset?.resolvedMetadata?.attributes)
</script>

<template>
  <template v-if="isLoaded">
    <div v-if="attributes?.length">
      <div class="heading-inter-14-bold pb-2">
        {{ $formatMessage('asset_attributes_title') }}
      </div>
      <div class="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
        <div
          v-for="(attribute, index) in attributes"
          :key="index"
          class="rounded-12 border border-neutral-90 bg-neutral-100 px-4 py-3"
        >
          <div class="paragraph-inter-10-bold-uppercase mb-3">
            {{ attribute.key }}
          </div>
          <div class="paragraph-inter-14-medium">{{ attribute.value }}</div>
        </div>
      </div>
    </div>
  </template>
  <AppPlaceholderSection v-else slot-class="flex gap-4">
    <AppPlaceholderLine class="h-[72px] w-[120px]" />
    <AppPlaceholderLine class="h-[72px] w-[80px]" />
  </AppPlaceholderSection>
</template>
