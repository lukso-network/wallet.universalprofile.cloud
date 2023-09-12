<script setup lang="ts">
import makeBlockie from 'ethereum-blockies-base64'

type Props = {
  address: Address
}

const props = defineProps<Props>()

const handleCopyTokenAddress = () => {
  navigator.clipboard.writeText(props.address)
}
</script>

<template>
  <div
    class="bg-neutral-100 border border-neutral-90 py-3 px-4 rounded-12 mb-8"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <img
          :src="makeBlockie(address)"
          alt=""
          class="shadow-shadow-1xl rounded-full outline outline-2 outline-neutral-100 right-0 bottom-0 w-4 h-4"
        />
        <div class="paragraph-inter-14-medium ml-2">
          {{ $formatMessage('token_details_contract_address') }}
        </div>
      </div>
      <lukso-icon
        name="copy"
        size="small"
        class="cursor-pointer transition-opacity hover:opacity-70"
        @click="handleCopyTokenAddress"
      ></lukso-icon>
    </div>
    <div class="paragraph-ptmono-12-bold pt-3">{{ address }}</div>
  </div>
</template>
