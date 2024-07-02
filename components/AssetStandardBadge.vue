<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isLoading)
const standard = computed(() => props.asset?.standard)
const slots = useSlots()
const { formatMessage } = useIntl()
</script>

<template>
  <lukso-tag v-if="slots.default" size="x-small" background-color="lukso-90"
    ><slot
  /></lukso-tag>
  <div v-else-if="isLoaded" class="flex whitespace-nowrap">
    <lukso-tag
      v-if="isCollection(asset)"
      size="x-small"
      background-color="lukso-90"
      >{{
        formatMessage('asset_standard_badge_collection_contract')
      }}</lukso-tag
    >
    <lukso-tag
      v-else-if="standard"
      size="x-small"
      :background-color="
        standard === STANDARDS.UNKNOWN ? 'neutral-90' : 'lukso-90'
      "
      >{{ STANDARDS_ABBREVIATIONS[standard as Standard] }}</lukso-tag
    >
  </div>
  <AppPlaceholderLine v-else class="h-[20px] w-10" />
</template>
