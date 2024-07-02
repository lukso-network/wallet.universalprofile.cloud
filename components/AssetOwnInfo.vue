<script setup lang="ts">
type Props = {
  address?: Address
  balance?: string
  symbol?: string
  decimals?: number
  profileImageUrl?: string
  message?: string
}

const props = defineProps<Props>()
</script>

<template>
  <lukso-card
    is-full-width
    border-radius="small"
    shadow="small"
    class="mt-8 sm:mt-4"
  >
    <div slot="content" class="flex px-4 py-2">
      <lukso-profile
        size="small"
        :profile-address="address"
        :profile-url="profileImageUrl"
        has-identicon
      ></lukso-profile>
      <div class="flex flex-col justify-center pl-4">
        <div class="paragraph-inter-10-semi-bold pb-1">
          {{ message }}
        </div>
        <div
          class="paragraph-inter-12-semi-bold flex flex-wrap gap-x-1 leading-15"
        >
          <span v-if="hasBalance(props)">{{
            $formatNumber(
              fromTokenUnitWithDecimals(getBalance(props), decimals),
              {
                maximumFractionDigits: decimals,
              }
            )
          }}</span>
          <span v-else>0</span>
          <span class="text-neutral-60 break-word">{{ symbol }}</span>
        </div>
      </div>
    </div>
  </lukso-card>
</template>
