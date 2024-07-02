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
const profileAvatar = useProfileAvatar(connectedProfile, 40)

const handleSendAsset = (event: Event) => {
  event.stopPropagation()

  let query: SendQueryParams = {
    asset: props.asset?.address,
    tokenId: props.asset?.tokenId,
  }

  if (isCollectible(props.asset)) {
    query = {
      ...query,
      amount: '1', // prefill amount field for collectibles
    }
  }

  navigateTo({
    path: sendRoute(connectedProfile.value?.address),
    query,
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

const handleViewCollection = () => {
  navigateTo(collectionRoute(props.asset?.address))
}
</script>

<template>
  {{ genericLog(token?.tokenName, toRaw(token)) }}
  <div
    class="relative mx-auto grid max-w-content gap-12 transition-opacity duration-300 md:grid-cols-[1fr,2fr]"
  >
    <div>
      <NftCard :asset="asset" @on-image-click="handlePreviewImage" />
      <AssetOwnInfo
        v-if="hasBalance(asset) && isConnected"
        :address="connectedProfile?.address"
        :balance="getBalance(asset)"
        :symbol="asset?.tokenSymbol"
        :decimals="0"
        :profile-image-url="profileAvatar?.url"
        :message="$formatMessage('nft_details_own')"
      />
      <div class="mt-12 flex flex-col gap-2">
        <lukso-button
          v-if="isLsp8(token)"
          variant="secondary"
          is-full-width
          @click="handleViewCollection"
          >{{ $formatMessage('token_details_show_collection') }}</lukso-button
        >
        <lukso-button
          v-if="hasBalance(asset) && isConnected"
          is-full-width
          @click="handleSendAsset"
          >{{ $formatMessage('token_details_send_collectible') }}</lukso-button
        >
      </div>
    </div>
    <div>
      <div class="heading-apax-24-medium flex items-center gap-2 pb-2">
        <AssetName :asset="asset" />
        <AssetStandardBadge :asset="asset" />
      </div>
      <AssetCollectionSupply :asset="asset" />
      <div class="flex flex-col gap-8">
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
  </div>
</template>
