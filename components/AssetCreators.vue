<script setup lang="ts">
type Props = {
  asset?: Asset
}

defineProps<Props>()

const { isRpc, isGraph } = useDataProvider()
</script>

<template>
  <AssetCreatorsRpc v-if="isRpc" :asset="asset" />
  <AssetCreatorsGraph v-if="isGraph" :asset="asset" />
</template>
