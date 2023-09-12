<script setup lang="ts">
import { ImageMetadata } from '@lukso/lsp-factory.js'

type Props = {
  images: ImageMetadata[][]
}

defineProps<Props>()
</script>

<template>
  <div class="mb-8">
    <div class="heading-inter-14-bold pb-3">
      {{ $formatMessage('token_details_images') }}
    </div>
    <div
      v-for="(image, index) in images"
      :key="index"
      class="w-14 h-14 rounded-8 bg-cover bg-position-center"
      :style="{
        backgroundImage: `url(${formatUrl(image[0].url)})`,
      }"
    ></div>
  </div>
</template>
