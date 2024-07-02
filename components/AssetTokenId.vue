<script setup lang="ts">
const { isMobile } = useDevice()
const { formatMessage } = useIntl()

type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isLoading)

const tokenLength = computed(() => {
  let tokenLength = 64

  if (isMobile) {
    tokenLength = 36
  }

  return tokenLength
})

const tooltipOptions = computed(() =>
  JSON.stringify([
    {
      id: 'copy_parsed',
      text: formatMessage('tooltip_text_copy'),
      value: parseTokenId(props.asset?.tokenId, props.asset?.tokenIdFormat),
    },
    {
      id: 'copy_raw',
      text: formatMessage('tooltip_text_copy_raw'),
      value: props.asset?.tokenId,
    },
  ])
)
</script>

<template>
  <template v-if="isLoaded">
    <lukso-tag v-if="hasTokenId(asset)" is-rounded>
      <div class="flex items-center">
        <div class="paragraph-ptmono-12-bold mr-2">
          {{
            prefixedTokenId(asset?.tokenId, asset?.tokenIdFormat, tokenLength)
          }}
        </div>
        <lukso-tooltip
          variant="white"
          trigger="mouseenter"
          offset="15"
          :options="tooltipOptions"
        >
          <lukso-icon
            name="copy"
            size="small"
            class="cursor-pointer transition-opacity hover:opacity-70"
          ></lukso-icon>
        </lukso-tooltip>
      </div>
    </lukso-tag>
  </template>
  <AppPlaceholderLine v-show="!isLoaded" class="h-[28px] w-1/3" />
</template>
