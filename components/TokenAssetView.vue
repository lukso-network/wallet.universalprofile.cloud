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
  event.stopPropagation()
  navigateTo({
    path: sendRoute(connectedProfile.value?.address),
    query: {
      asset: token.value?.address,
    },
  })
}

const handlePreviewImage = () => {
  const image =
    token.value?.resolvedMetadata?.images?.[0] ||
    token.value?.resolvedMetadata?.icon

  if (!image) {
    return
  }

  showModal({
    template: 'AssetImage',
    data: {
      asset: image,
    },
    size: 'auto',
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
        <AssetOwnInfo
          v-if="hasBalance(token) && isConnected"
          :address="connectedProfile?.address"
          :balance="getBalance(token)"
          :symbol="token?.tokenSymbol"
          :decimals="token?.decimals"
          :profile-image-url="profileAvatar?.url"
          :message="$formatMessage('token_details_own')"
        />
        <div class="mt-12 flex flex-col gap-2">
          <lukso-button
            v-if="hasBalance(asset) && isConnected"
            is-full-width
            @click="handleSendAsset"
            >{{
              $formatMessage('token_details_send', {
                token: truncate(token?.tokenSymbol, 10) || '',
              })
            }}</lukso-button
          >
        </div>
      </div>
      <div>
        <div class="heading-apax-24-medium flex items-center gap-2 pb-2">
          <AssetName :asset="asset" />
          <AssetStandardBadge :asset="asset" />
        </div>
        <div class="flex flex-col gap-8">
          <AssetTokenSupply :asset="token" />
          <AssetDescription :asset="token" />
          <AssetImagesList :asset="token" />
          <AssetAssets :asset="token" />
          <AssetAttributes :asset="token" />
          <AssetCreators :asset="token" />
          <AssetLinks :asset="token" />
          <AssetAddress :asset="asset" />
        </div>
      </div>
    </div>
  </div>
</template>
