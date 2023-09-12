<script setup lang="ts">
import { fromWei } from 'web3-utils'

type Props = {
  profile: Profile
  amount?: string
  symbol?: string
}

defineProps<Props>()
</script>

<template>
  <lukso-card is-full-width size="small" class="mt-4">
    <div slot="content" class="px-4 py-2 flex">
      <lukso-profile
        size="small"
        :profile-address="profile.address"
        :profile-url="profile.profileImageUrl"
        has-identicon
      ></lukso-profile>
      <div class="pl-4 flex flex-col justify-center">
        <div class="paragraph-inter-10-semi-bold pb-1">
          {{ $formatMessage('token_details_own') }}
        </div>
        <div class="paragraph-inter-12-semi-bold">
          <span v-if="amount">{{
            $formatNumber(fromWei(amount, 'ether'))
          }}</span>
          <span v-else>0</span>
          <span class="text-neutral-60 ml-1">{{ symbol }}</span>
        </div>
      </div>
    </div>
  </lukso-card>
</template>
