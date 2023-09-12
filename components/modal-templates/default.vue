<script setup lang="ts">
const appStore = useAppStore()

type Props = {
  closeModal: () => void
}

defineProps<Props>()
</script>

<template>
  <div class="bg-neutral-98 text-center p-6 rounded-12 flex flex-col">
    <img
      v-if="appStore.modal?.icon"
      :src="appStore.modal.icon"
      class="mx-auto w-[150px] mb-6"
      alt=""
    />
    <div class="heading-inter-21-semi-bold pb-4">
      {{ appStore.modal?.title || $formatMessage('modal_default_title') }}
    </div>
    <div class="paragraph-inter-16-regular">
      <lukso-sanitize :html-content="appStore.modal?.message"></lukso-sanitize>
    </div>
    <lukso-button
      variant="landing"
      is-full-width
      @click="closeModal"
      class="mt-6"
    >
      {{
        appStore.modal?.confirmButtonText ||
        $formatMessage('modal_default_confirm')
      }}
    </lukso-button>
  </div>
</template>
