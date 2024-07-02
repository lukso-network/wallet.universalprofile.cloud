<script setup lang="ts">
const { isGraph, isRpc } = useDataProvider()
</script>

<template>
  <AppNavbarProfileSearchGraph v-if="isGraph" />
  <AppNavbarProfileSearchRpc v-if="isRpc" />
</template>
