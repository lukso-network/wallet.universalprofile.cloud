<script setup lang="ts">
type Props = {
  tokens?: Asset[]
}

defineProps<Props>()

const { isOwned } = useFilters()
</script>

<template>
  <div class="pt-8">
    <h3 class="heading-inter-17-semi-bold pb-4">
      {{ $formatMessage('tokens_title') }}
    </h3>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      <TokenListLyxCard v-if="isOwned" />
      <TokenListCardGraph
        v-for="(asset, index) in tokens"
        :key="index"
        :asset="asset"
      />
    </div>
  </div>
</template>
