<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()
type Props = {
  asset?: Asset | null
}
const props = defineProps<Props>()
const asset = computed(() => props.asset)
const token = useToken()(asset)
const { showModal } = useModal()
const { isConnected } = storeToRefs(useAppStore())
const assetImage = useAssetImage(token, isLsp7(token.value), 60)

const profileAvatar = useProfileAvatar(connectedProfile, 260)

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile.value?.address, 'profile')
    assertAddress(token.value?.address, 'token')
    navigateTo({
      path: sendRoute(connectedProfile.value.address),
      query: {
        asset: token.value.address
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const handlePreviewImage = () => {
  const image = token.value?.resolvedMetadata?.icon

  if (!image) {
    return
  }

  showModal({
    template: 'AssetImage',
    data: {
      asset: image
    },
    size: 'auto'
  })
}
</script>

<template>
  {{ genericLog(token?.tokenName, toRaw(token)) }}
  <div class="relative">
    <div
      class="relative mx-auto grid max-w-content gap-12 transition-opacity duration-300 md:grid-cols-[1fr,2fr]"
    >
      <div>
        <lukso-card
          class="cursor-pointer"
          is-full-width
          border-radius="small"
          shadow="small"
          @click="handlePreviewImage"
        >
          <div
            slot="content"
            class="flex min-h-64 items-center justify-center p-6 sm:py-10 md:py-20"
          >
            <lukso-profile
              v-if="token"
              size="large"
              :profile-url="assetImage?.url"
              class="rounded-full shadow-neutral-above-shadow-1xl"
            ></lukso-profile>
          </div>
        </lukso-card>
        <div v-if="token?.balance !== '0' && isConnected">
          <AssetOwnInfo
            :address="connectedProfile?.address"
            :balance="token?.balance"
            :symbol="token?.tokenSymbol"
            :decimals="token?.decimals"
            :profile-image-url="profileAvatar?.url"
            :message="$formatMessage('token_details_own')"
          />

          <lukso-button is-full-width class="mt-12" @click="handleSendAsset">{{
            $formatMessage('token_details_send', {
              token: token?.tokenSymbol || '',
            })
          }}</lukso-button>
        </div>
      </div>
      <div>
        <div class="heading-apax-24-medium flex items-center gap-2 pb-2">
          <AssetName :asset="asset" />
          <AssetStandardBadge :asset="asset" />
        </div>
        <AssetTokenSupply :asset="asset" />
        <AssetDescription :asset="token" />
        <AssetImagesList :asset="token" />
        <AssetAssets :asset="token" />
        <AssetAttributes :asset="token" />
        <AssetLinks :asset="token" />
        <AssetAddress :asset="asset" />
      </div>
    </div>
  </div>
</template>
