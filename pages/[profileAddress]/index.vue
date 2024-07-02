<script setup lang="ts">
const { isRpc, isGraph } = useDataProvider()
</script>

<template>
  <ProfileViewRpc v-if="isRpc" />
  <ProfileViewGraph v-if="isGraph" />
</template>
