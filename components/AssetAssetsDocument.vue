<script setup lang="ts">
type Props = {
  asset?: AssetMetadata
}

const props = defineProps<Props>()

const handleClick = () => {
  ;(props?.asset as FileAsset | undefined)?.url &&
    window.open((props.asset as FileAsset).url, '_blank')
}
</script>

<template>
  <div
    class="paragraph-inter-10-bold-uppercase flex size-14 cursor-pointer flex-col items-center justify-center rounded-8 border border-neutral-90 bg-neutral-100 bg-cover transition hover:scale-[1.02] hover:shadow-neutral-drop-shadow"
    @click="handleClick"
  >
    <lukso-icon name="document-outline" class="mb-1"></lukso-icon>
    {{ $formatMessage('token_asset_type_document') }}
  </div>
</template>
