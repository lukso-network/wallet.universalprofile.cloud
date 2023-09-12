<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { profile: connectedProfile } = useConnectionStore()
const { receiver } = storeToRefs(useSendStore())
</script>

<template>
  <div class="grid grid-cols-[1fr,min-content,1fr] w-full">
    <div class="flex flex-col items-center">
      <div class="flex flex-col items-center">
        <lukso-profile
          size="large"
          :profile-url="connectedProfile.profileImageUrl"
          :profile-address="connectedProfile.address"
          has-identicon
        ></lukso-profile>
        <lukso-username
          v-if="connectedProfile.name"
          :name="connectedProfile.name"
          size="small"
          class="my-1"
        ></lukso-username>
        <lukso-username
          v-else
          :address="connectedProfile.address"
          :slice-by="4"
          size="small"
          class="text-neutral-60 my-1"
        ></lukso-username>
      </div>
    </div>
    <div class="flex items-center">
      <div class="w-[20px] h-[92px] bg-neutral-100 z-[1]"></div>
      <div
        class="w-0 h-0 border-t-[46px] border-b-[46px] border-l-[16px] border-transparent border-l-neutral-100 border-solid drop-shadow-[8px_0_9px_rgba(118,109,158,0.5)]"
      ></div>
    </div>
    <div class="flex flex-col items-center">
      <div class="flex flex-col items-center">
        <lukso-profile
          size="large"
          :profile-url="receiver?.profileImageUrl"
          :profile-address="receiver?.address"
          has-identicon
        ></lukso-profile>
        <lukso-username
          v-if="receiver?.name"
          :name="receiver.name"
          size="small"
          class="my-1"
        ></lukso-username>
        <lukso-username
          v-else
          :address="receiver?.address"
          :slice-by="4"
          size="small"
          class="text-neutral-60 my-1"
        ></lukso-username>
      </div>
    </div>
  </div>
</template>
