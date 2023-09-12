<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { isDraft, isPending, isSuccess } = storeToRefs(useSendStore())
</script>

<template>
  <div class="max-w-[480px] py-20 px-4 mx-auto w-full">
    <SendDraft v-if="isDraft" />
    <SendPending v-if="isPending" />
    <SendSuccess v-if="isSuccess" />
  </div>
</template>
