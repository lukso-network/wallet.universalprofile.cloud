<script setup lang="ts">
import type { Asset } from '@/types/asset'

type Props = {
  asset?: Asset | null
}
const props = defineProps<Props>()

const connectedProfile = useProfile().connectedProfile()
const asset = computed(() => props.asset)
const token = useToken()(asset)
const { showModal } = useModal()
const { isConnected } = storeToRefs(useAppStore())
const assetImage = useAssetImage(token, false, 260)
const profileAvatar = useProfileAvatar(connectedProfile, 40)

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile?.value?.address, 'profile')
    assertAddress(token.value?.address, 'nft')

    let query: SendQueryParams = {
      asset: props.asset?.address,
      tokenId: props.asset?.tokenId
    }

    if (isCollectible(props.asset)) {
      query = {
        ...query,
        amount: '1' // prefill amount field for collectibles
      }
    }

    navigateTo({
      path: sendRoute(connectedProfile.value.address),
      query
    })
  } catch (error) {
    console.error(error)
  }
}

const assetTokenId = computed(() => {
  return prefixedTokenId(token.value?.tokenId, token.value?.tokenIdFormat, 36)
})

const handlePreviewImage = () => {
  const image = token.value?.resolvedMetadata?.images?.[0]

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
  <div
    class="relative mx-auto grid max-w-content gap-12 transition-opacity duration-300 md:grid-cols-[1fr,2fr]"
  >
    <div>
      <lukso-card border-radius="small" shadow="small" is-full-width
        ><div slot="content">
          <AssetImage
            class="min-h-[260px] cursor-pointer rounded-t-12"
            :image="assetImage"
            @click="handlePreviewImage"
          />
          <div class="relative p-4">
            <div class="paragraph-inter-14-semi-bold flex items-center gap-1">
              <div v-if="asset">{{ asset?.tokenName }}</div>
              <AppPlaceholderLine v-else class="h-[22px] w-1/2" />

              <div
                v-if="asset"
                class="paragraph-inter-10-semi-bold text-neutral-60"
              >
                {{ asset?.tokenSymbol }}
              </div>
              <AppPlaceholderLine v-else class="h-[12px] w-1/6" />
            </div>
            <div v-if="asset" class="paragraph-ptmono-10-bold mt-1">
              <span v-if="isLsp8(asset)">
                {{ assetTokenId }}
              </span>
              <span v-else-if="asset.balance">
                {{ $formatMessage('token_owned') }}
                {{ asset?.balance }}
              </span>
            </div>
            <AppPlaceholderLine v-else class="mt-1 h-[11px] w-1/6" />
          </div>
        </div>
      </lukso-card>
      <div v-if="asset?.balance !== '0' && isConnected">
        <AssetOwnInfo
          :address="connectedProfile?.address"
          :balance="asset?.balance"
          :symbol="asset?.tokenSymbol"
          :decimals="0"
          :profile-image-url="profileAvatar?.url"
          :message="$formatMessage('nft_details_own')"
        />

        <lukso-button is-full-width class="mt-12" @click="handleSendAsset">{{
          $formatMessage('token_details_send_collectible')
        }}</lukso-button>
      </div>
    </div>
    <div>
      <div class="heading-apax-24-medium flex items-center gap-2 pb-2">
        <AssetName :asset="asset" />
        <AssetStandardBadge :asset="asset" />
      </div>
      <AssetCollectionSupply :asset="asset" />
      <AssetTokenId :asset="asset" />
      <AssetDescription :asset="token" />
      <AssetImagesList :asset="token" />
      <AssetAssets :asset="token" />
      <AssetAttributes :asset="token" />
      <AssetCreators :asset="token" />
      <AssetLinks :asset="token" />
      <AssetAddress :asset="asset" />
    </div>
  </div>
</template>
