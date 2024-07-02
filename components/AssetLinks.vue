<script setup lang="ts">
import type { ButtonSize } from '@lukso/web-components'

type Props = {
  asset?: Asset
  buttonSize?: ButtonSize
  withoutTitle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  asset: undefined,
  buttonSize: 'medium',
  withoutTitle: false,
})
const { isMobile } = useDevice()
const { formatMessage } = useIntl()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
const links = computed(() => props.asset?.resolvedMetadata?.links)
</script>

<template>
  <template v-if="isLoaded">
    <div v-if="links?.length">
      <div v-if="!withoutTitle" class="heading-inter-14-bold pb-2">
        {{ formatMessage('asset_links_title') }}
      </div>
      <div class="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
        <div v-for="(link, index) in links" :key="index" class="inline-flex">
          <lukso-button
            variant="secondary"
            :size="buttonSize"
            is-link
            :href="link.url"
            :is-full-width="isMobile ? true : undefined"
            custom-class="paragraph-inter-14-medium"
          >
            <div class="flex w-full items-center text-left">
              {{ link.title || link.url }}
              <lukso-icon name="link-1" size="small" class="ml-2"></lukso-icon>
            </div>
          </lukso-button>
        </div>
      </div>
    </div>
  </template>
  <AppPlaceholderSection v-else slot-class="flex gap-4">
    <AppPlaceholderLine
      :class="{
        'h-[48px] w-[170px]': buttonSize === 'medium',
        'h-[24px] w-[90px]': buttonSize === 'small',
      }"
    />
    <AppPlaceholderLine
      :class="{
        'h-[48px] w-[170px]': buttonSize === 'medium',
        'h-[24px] w-[90px]': buttonSize === 'small',
      }"
    />
  </AppPlaceholderSection>
</template>
