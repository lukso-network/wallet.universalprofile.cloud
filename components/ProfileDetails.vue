<script setup lang="ts">
const viewedProfile = useProfile().viewedProfile()

const hasLinks = computed(
  () => viewedProfile?.value?.links && viewedProfile.value.links?.length > 0
)
const hasDescription = computed(
  () =>
    viewedProfile?.value?.description && viewedProfile.value.description !== ''
)
const hasTags = computed(
  () => viewedProfile?.value?.tags && viewedProfile.value.tags?.length > 0
)
</script>

<template>
  <div
    v-if="hasDescription || hasLinks || hasTags"
    class="mx-auto py-6 sm:w-1/2"
  >
    <ul
      v-if="hasTags"
      class="mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2"
    >
      <li
        v-for="(tag, index) in viewedProfile?.tags"
        :key="index"
        class="inline-flex"
      >
        <lukso-tag is-rounded>{{ tag }}</lukso-tag>
      </li>
    </ul>
    <div
      v-if="hasDescription"
      class="paragraph-inter-12-medium text-center break-word"
    >
      {{ viewedProfile?.description }}
    </div>
    <ul
      v-if="hasLinks"
      class="mt-3 flex flex-col flex-wrap justify-center gap-x-4 gap-y-2 sm:flex-row"
    >
      <li
        v-for="(link, index) in viewedProfile?.links"
        :key="index"
        class="inline-flex"
      >
        <lukso-button
          size="small"
          :href="link.url"
          is-link
          variant="secondary"
          class="transition hover:opacity-70"
          is-full-width
          >{{ link.title }}
          <lukso-icon name="link-3" size="small" class="ml-2"></lukso-icon>
        </lukso-button>
      </li>
    </ul>
  </div>
</template>
