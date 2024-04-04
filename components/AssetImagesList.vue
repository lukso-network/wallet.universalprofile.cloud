<script setup lang="ts">
import type { Image } from '@/types/image'

type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const { showModal } = useModal()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
const images = computed(() => props.asset?.resolvedMetadata?.images || null)

const optimizedImages = useOptimizedImages(images, 56)

const handlePreviewImage = (image: Image[]) => {
  showModal({
    template: 'AssetImage',
    data: {
      asset: [image[0]]
    },
    size: 'auto'
  })
}
</script>

<template>
  <div v-if="isLoaded">
    <div v-if="images?.length" class="mb-8">
      <div class="heading-inter-14-bold pb-3">
        {{ $formatMessage('token_details_images') }}
      </div>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="(image, index) in optimizedImages"
          :key="index"
          class="rounded-8 bg-neutral-90 transition hover:scale-[1.02] hover:shadow-neutral-drop-shadow"
        >
          <AssetImage
            class="!size-14 min-h-14 cursor-pointer rounded-8"
            :image="image.optimized"
            @click="handlePreviewImage(image.original || [])"
          />
        </div>
      </div>
    </div>
  </div>
  <AppPlaceholderSection v-else slot-class="flex gap-4">
    <AppPlaceholderLine class="size-14" />
    <AppPlaceholderLine class="size-14" />
    <AppPlaceholderLine class="size-14" />
  </AppPlaceholderSection>
</template>
