<script setup lang="ts">
const address = useRouter().currentRoute.value.params?.collectionAddress
const asset = useAsset()(address)
</script>

<template>
  <AppPageLoader :is-loading="!asset">
    <CollectionView :asset="asset" />
  </AppPageLoader>
</template>
