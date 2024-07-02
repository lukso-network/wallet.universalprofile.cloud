<script setup lang="ts">
const { isGraph, isRpc } = useDataProvider()
</script>

<template>
  <ProfileShowcaseGraph v-if="isGraph" />
  <ProfileShowcaseRpc v-if="isRpc" />
</template>
