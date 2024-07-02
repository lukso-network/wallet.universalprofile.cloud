<script setup lang="ts">
const { isGraph, isRpc } = useDataProvider()
</script>

<template>
  <SendCardProfileSearchGraph v-if="isGraph" />
  <SendCardProfileSearchRpc v-if="isRpc" />
</template>
