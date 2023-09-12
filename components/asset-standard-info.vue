<script setup lang="ts">
import { InterfaceId, StandardsAbbreviations } from '@/types/assets'

type Props = {
  standard?: InterfaceId
}

const { formatMessage } = useIntl()
const props = defineProps<Props>()
const standardsAbbreviation = ref<string>()
const isLegacy = ref(false)
const title = ref<string>()
const details = ref<string>()

onMounted(() => {
  standardsAbbreviation.value =
    props.standard && StandardsAbbreviations[props.standard]

  isLegacy.value =
    props.standard !== 'LSP7DigitalAsset' &&
    props.standard !== 'LSP8IdentifiableDigitalAsset'

  if (isLegacy.value) {
    title.value = formatMessage('asset_standard_info_legacy_title')
    details.value = formatMessage('asset_standard_info_legacy_details')
  } else {
    title.value = formatMessage(
      `asset_standard_info_${standardsAbbreviation.value}_title`
    )
    details.value = formatMessage(
      `asset_standard_info_${standardsAbbreviation.value}_details`
    )
  }
})
</script>

<template>
  <div
    v-if="standardsAbbreviation"
    class="rounded-8 p-4"
    :class="isLegacy ? 'bg-yellow-85' : 'bg-lukso-90'"
  >
    <div class="heading-inter-14-bold pb-1">
      {{ title }}
    </div>
    <div class="paragraph-inter-12-regular">
      {{ details }}
    </div>
  </div>
</template>
