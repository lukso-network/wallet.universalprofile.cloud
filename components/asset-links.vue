<script setup lang="ts">
import { LinkMetadata } from '@lukso/lsp-factory.js'

type Props = {
  links: LinkMetadata[]
}

defineProps<Props>()
</script>

<template>
  <div
    class="bg-neutral-100 border border-neutral-90 py-3 px-4 rounded-12 mb-8"
  >
    <div v-for="(link, index) in links" :key="index" class="flex items-center">
      <lukso-icon name="link" size="small"></lukso-icon>
      <a
        target="_blank"
        :href="link.url"
        class="paragraph-inter-14-medium ml-2 hover:underline"
        >{{ link.title }}</a
      >
    </div>
  </div>
</template>
