<script setup lang="ts">
type Props = {
  asset?: Asset
  withoutTitle?: boolean
}

const props = defineProps<Props>()
const { formatMessage } = useIntl()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
const description = computed(() => props.asset?.resolvedMetadata?.description)
</script>

<template>
  <template v-if="isLoaded">
    <div v-if="description">
      <div v-if="!withoutTitle" class="heading-inter-14-bold pb-3">
        {{ formatMessage('token_details_description') }}
      </div>
      <div class="paragraph-inter-12-regular whitespace-pre-line break-word">
        {{ description }}
      </div>
    </div>
  </template>
  <AppPlaceholderMultiline v-else />
</template>
