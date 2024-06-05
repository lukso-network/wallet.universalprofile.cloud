<script setup lang="ts">
import UniversalProfileJson from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json'
import { Contract } from 'web3'

const connectedProfile = useProfile().connectedProfile()
const assetAddress = useRouter().currentRoute.value.params?.assetAddress
const isPending = ref(false)

const asset = useAsset()(assetAddress)

const handleBackToSettings = () => {
  navigateTo(settingsRoute())
}

const handleCancel = () => {
  navigateTo(settingsMissingAssetsRoute())
}

const handleAddAsset = async () => {
  try {
    isPending.value = true
    const interfaceId = Object.entries(
      asset.value.supportsInterfaces || {}
    ).filter(([, value]) => value)[0]?.[0]
    const profileAddress = connectedProfile.value?.address

    const { keys, values } = generateAddReceivedAssetKeys(
      assetAddress,
      interfaceId,
      profileAddress,
      connectedProfile.value?.receivedAssets
    )
    const profileContract = new Contract<typeof UniversalProfileJson.abi>(
      UniversalProfileJson.abi,
      profileAddress
    )
    await profileContract.methods
      .setDataBatch(keys, values)
      .send({ from: profileAddress })
    navigateTo(settingsMissingAssetsSuccessRoute(assetAddress))
  } catch (error) {
    console.error(error)
  } finally {
    isPending.value = false
  }
}

const isLoaded = computed(() => asset.value && !asset.value.isLoading)

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
        {{ $formatMessage('confirm_missing_assets_title') }}
      </h3>
      <p class="paragraph-inter-14-regular pb-2 text-neutral-40">
        {{ $formatMessage('confirm_missing_assets_description') }}
      </p>
      <MissingAssetPreview v-if="isLoaded" :asset="asset" />
      <div
        v-else
        class="rounded-12 border border-neutral-90 bg-neutral-100 px-6 py-4"
      >
        <div class="flex gap-6">
          <div class="flex flex-col items-center gap-2">
            <AppPlaceholderCircle class="size-14" />
            <AppPlaceholderLine class="h-[14px] w-full" />
          </div>
          <div class="flex w-full flex-col justify-center gap-1">
            <div class="heading-inter-14-bold break-word">
              <AppPlaceholderLine class="h-[17px] w-1/3" />
            </div>
            <div>
              <div class="grid grid-cols-[2fr,1fr] items-center gap-2">
                <AppPlaceholderLine class="h-[26px] w-full" />
                <AppPlaceholderLine class="h-[22px] w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-[max-content,auto]">
        <lukso-button
          class="mt-6"
          variant="text"
          @click="handleCancel"
          :disabled="isPending ? true : undefined"
        >
          {{ $formatMessage('add_missing_assets_cancel_button') }}
        </lukso-button>
        <lukso-button
          is-full-width
          class="mt-6"
          @click="handleAddAsset"
          :is-loading="isPending ? true : undefined"
          :loading-text="$formatMessage('add_missing_assets_add_button')"
        >
          {{ $formatMessage('add_missing_assets_add_button') }}
        </lukso-button>
      </div>
    </div>
  </AppPageLoader>
</template>
