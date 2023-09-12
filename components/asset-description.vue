<script setup lang="ts">
type Props = {
  description: string
}

defineProps<Props>()
</script>

<template>
  <div class="mb-8">
    <div class="heading-inter-14-bold pb-3">
      {{ $formatMessage('token_details_description') }}
    </div>
    <div class="paragraph-inter-12-regular">
      {{ description }}
    </div>
  </div>
</template>
