<script setup lang="ts">
const { isGraph } = useDataProvider()
</script>

<template>
  <AssetShowcaseGraph v-if="isGraph" />
</template>
