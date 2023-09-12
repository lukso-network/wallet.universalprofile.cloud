<script setup lang="ts">
const { setStatus, clearSend } = useSendStore()

const handleSendMore = () => {
  clearSend()
  setStatus('draft')
}
</script>

<template>
  <lukso-card variant="with-header" is-full-width>
    <div slot="header" class="px-6 py-10 flex flex-col">
      <ProfileHeader />
    </div>
    <div slot="content" class="p-8 flex flex-col items-center">
      <div class="heading-inter-17-semi-bold">
        {{ $formatMessage('send_success_title') }}
      </div>
      <lukso-icon
        name="progress-complete"
        size="x-large"
        class="my-6"
      ></lukso-icon>
      <lukso-button variant="secondary" @click="handleSendMore">{{
        $formatMessage('send_success_button')
      }}</lukso-button>
    </div>
  </lukso-card>
</template>
