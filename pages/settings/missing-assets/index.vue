<script setup lang="ts">
import { Contract } from 'web3'
import { isAddress } from 'web3-validator'

import { balanceOfABI } from '@/shared/abis/balanceOfABI'

const connectedProfile = useProfile().connectedProfile()
const { formatMessage } = useIntl()
const checkError = ref('')
const assetAddress = ref('')

const handleBackToSettings = () => {
  navigateTo(settingsRoute())
}

const handleCheckOwnership = () => {
  assertAddress(assetAddress.value)
  navigateTo(settingsMissingAssetsAddRoute(assetAddress.value))
}

const handleInput = async (customEvent: CustomEvent) => {
  const event = customEvent.detail.event
  const input = event.target as HTMLInputElement
  checkError.value = ''
  assetAddress.value = input.value

  // if no value is entered we just exit here
  if (!input.value) {
    return
  }

  // check if address has valid format
  if (!isAddress(input.value)) {
    checkError.value = formatMessage('errors_invalid_address')
    return
  }

  // check if user is owner of the asset (both LSP7 and LSP8 return balance)
  try {
    const assetContract = new Contract<typeof balanceOfABI>(
      balanceOfABI,
      assetAddress.value
    )
    assertString(connectedProfile.value?.address)
    const balance = (await assetContract.methods
      .balanceOf(connectedProfile.value?.address)
      .call()) as bigint

    if (balance === 0n) {
      checkError.value = formatMessage('errors_not_owner')
      return
    }
  } catch (e) {
    checkError.value = formatMessage('errors_get_asset_balance')
    return
  }

  assertAddress(assetAddress.value)

  // check if user doesn't already have the asset
  if (connectedProfile.value?.receivedAssets?.includes(assetAddress.value)) {
    checkError.value = formatMessage('errors_already_owned')
    return
  }
}

const hasError = computed(() => {
  return !!checkError.value || !assetAddress.value
})

useProtectedRoute()
</script>

<template>
  <AppPageLoader :is-loading="connectedProfile?.isLoading">
    <div class="mx-auto w-full sm:w-[440px]">
      <h1
        class="heading-inter-17-semi-bold group mb-8 flex cursor-pointer items-center gap-1 border-b border-b-neutral-90 pb-6"
        @click="handleBackToSettings"
      >
        <lukso-icon
          name="arrow-left-lg"
          class="transition group-hover:-translate-x-1"
        ></lukso-icon>
        {{ $formatMessage('missing_assets_page_title') }}
      </h1>
      <h3 class="paragraph-inter-16-semi-bold pb-2">
        {{ $formatMessage('missing_assets_token_address') }}
      </h3>
      <p class="paragraph-inter-14-regular pb-2 text-neutral-40">
        {{ $formatMessage('missing_assets_description') }}
      </p>
      <lukso-input
        :value="assetAddress"
        :placeholder="$formatMessage('missing_assets_placeholder')"
        :error="checkError"
        is-full-width
        custom-class="paragraph-ptmono-14-regular"
        @on-input="handleInput"
      ></lukso-input>
      <lukso-button
        :disabled="hasError ? true : undefined"
        is-full-width
        class="mt-6"
        @click="handleCheckOwnership"
      >
        {{ $formatMessage('missing_assets_check_button') }}
      </lukso-button>
    </div>
  </AppPageLoader>
</template>
