<script setup lang="ts">
type Props = {
  tokenId: string
}

const props = defineProps<Props>()

const handleCopyTokenAddress = () => {
  navigator.clipboard.writeText(props.tokenId)
}
</script>

<template>
  <div
    class="bg-neutral-100 border border-neutral-90 py-3 px-4 rounded-12 mb-8"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <lukso-icon name="smart-contract-doc" size="small"></lukso-icon>
        <div class="paragraph-inter-14-medium ml-2">
          {{ $formatMessage('token_details_token_id') }}
        </div>
      </div>
      <lukso-icon
        name="copy"
        size="small"
        class="cursor-pointer transition-opacity hover:opacity-70"
        @click="handleCopyTokenAddress"
      ></lukso-icon>
    </div>
    <div class="paragraph-ptmono-12-bold pt-3">{{ tokenId }}</div>
  </div>
</template>
