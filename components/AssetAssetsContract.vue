<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()

const handleClick = () => {
  navigateTo(assetRoute(props.asset?.address, props.asset?.tokenId))
}
</script>

<template>
  <div
    class="paragraph-inter-10-bold-uppercase flex size-14 cursor-pointer flex-col items-center justify-center rounded-8 border border-neutral-90 bg-neutral-100 bg-cover transition hover:scale-[1.02] hover:shadow-neutral-drop-shadow"
    @click="handleClick"
  >
    <lukso-icon name="smart-contract-doc" class="mb-1"></lukso-icon>
    {{ $formatMessage('token_asset_type_contract') }}
  </div>
</template>
